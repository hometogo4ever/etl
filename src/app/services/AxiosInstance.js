const axios = require("axios");
const cheerio = require("cheerio");
const { CookieJar } = require("tough-cookie");
const https = require("https");

const AxiosInstance = (function () {
  let instance;

  function createInstance() {
    const jar = new CookieJar();

    console.log("Node version:", process.version);
    console.log("Platform:", process.platform);
    console.log("Axios version:", require("axios/package.json").version);

    const client = axios.create({
      withCredentials: true,
      validateStatus: () => true,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
      maxRedirects: 0,
      httpsAgent: new https.Agent({
        keepAlive: true,
      }),
    });

    client.interceptors.response.use(
      async (response) => {
        const url = response.config.url || "";
        const setCookie = response.headers["set-cookie"];

        if (setCookie) {
          for (const cookie of setCookie) {
            try {
              await jar.setCookie(cookie, url);
              console.log("[쿠키 저장됨]", cookie);
            } catch (e) {
              console.warn("[쿠키 저장 실패]", cookie, e);
            }
          }
        }

        // Handle 3xx redirect manually
        const status = response.status;
        const location = response.headers.location;

        if (status >= 300 && status < 400 && location) {
          const redirectedUrl = new URL(location, url).toString();
          console.log("[리디렉션 발생]", redirectedUrl);

          // Clone original config and update the URL
          const newConfig = {
            ...response.config,
            url: redirectedUrl,
          };

          return client(newConfig); // Re-run the request manually
        }

        return response;
      },
      (error) => {
        console.error("[응답 에러]", error.message);
        return Promise.reject(error);
      }
    );

    client.interceptors.request.use(async (config) => {
      const cookieStr = await jar.getCookieString(config.url || "");
      config.headers["Cookie"] = cookieStr;
      console.log("[요청 쿠키]", config.url, cookieStr);
      return config;
    });

    return {
      client: client,
      jar: jar,
      async initialBegin() {
        const res = await client.get("https://myetl.snu.ac.kr/login");

        console.log(res.headers["set-cookie"]);
        const html = res.data;

        const $ = cheerio.load(html);
        const agt_id = $("input[name=agt_id]").val();
        const agt_url = $("input[name=agt_url]").val();
        const agt_r = $("input[name=agt_r]").val();

        return { agt_id, agt_url, agt_r };
      },
      async initialLing(agt_id, agt_url, agt_r) {
        const { data: html } = await client.post(
          "http://nsso.snu.ac.kr/sso/usr/login/link",
          "agt_id=" + agt_id + "&agt_url=" + agt_url + "&agt_r=" + agt_r
        );

        const $ = cheerio.load(html);
        const login_key = $("input[name=login_key]").val();

        return login_key;
      },
      async initKey(pub_key) {
        const { data } = await client.post(
          "https://nsso.snu.ac.kr/sso/usr/snu/login/init",
          "user_ec_publickey=" + pub_key
        );

        if (data.code === "SS0001") {
          return { svr_qx: data.svr_qx, svr_qy: data.svr_qy };
        } else {
          return Promise.reject(data);
        }
      },
      async auth(req_data) {
        const { data } = await client.post(
          "https://nsso.snu.ac.kr/sso/usr/snu/mfa/login/auth",
          req_data
        );

        return data;
      },
      async sendAuthMSG(crtfc_type, login_key) {
        const { data } = await client.post(
          "https://nsso.snu.ac.kr/sso/usr/snu/mfa/login/ajaxUserSend",
          "crtfc_type=" + crtfc_type + "&login_key=" + login_key
        );

        return data;
      },
      async verifyMSG(crt_no, login_key) {
        const { data } = await client.post(
          "https://nsso.snu.ac.kr/sso/usr/snu/mfa/login/ajaxUserAuthId",
          "crtfc_no=" +
            crt_no +
            "&login_key=" +
            login_key +
            "&bypass_check=false"
        );

        return data;
      },

      async getPNI(login_key) {
        function extractLoginCryptionParams(html) {
          const regex = /window\.loginCryption\("([^"]+)", "([^"]+)"\)/;
          const match = html.match(regex);

          if (match) {
            return {
              param1: match[1], // 첫 번째 인자
              param2: match[2], // 두 번째 인자
            };
          } else {
            return null; // 찾지 못한 경우
          }
        }

        const { data: html } = await client.post(
          "https://nsso.snu.ac.kr/sso/usr/snu/login/link",
          "user_data=&login_key=" + login_key
        );

        const $ = cheerio.load(html);
        const pni_login_type = $("input[name=pni_login_type]").val();
        const pni_data = $("input[name=pni_data]").val();

        const { data } = await client.post(
          "https://etl.snu.ac.kr/passni/sso/spLoginData.php",
          "pni_login_type=" + pni_login_type + "&pni_data=" + pni_data
        );

        const response = await client.get(
          "https://etl.snu.ac.kr/xn-sso/gw-cb.php"
        );
        const status = response.status;
        const head = response.headers;
        const html2 = response.data;
        const { param1, param2 } = extractLoginCryptionParams(html2);
        return { param1, param2 };
      },
      async loginCanvas(id, pw) {
        const response = await client.post(
          "https://myetl.snu.ac.kr/login/canvas",
          "utf8=✓&redirect_to_ssl=1&after_login_url=&pseudonym_session[unique_id]=" +
            id +
            "&pseudonym_session[password]=" +
            pw +
            "&pseudonym_session[remember_me]=0"
        );

        console.log(data);
        return data;
      },
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();
module.exports = AxiosInstance;

// filename: generateKeys.js
import { BigInteger, SecureRandom } from "jsbn";
import pkg from "ecc-jsbn";
const { ECCurves } = pkg;
import { ECCurveFp, ECPointFp } from "ecc-jsbn/lib/ec.js";
import tough from "tough-cookie";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import * as cheerio from "cheerio";
import CryptoJS from "./crypto/seed.js";
import readline from "readline";
import JSEncrypt from "./jsencrypt.min.js";

class LoginAuth {
  constructor() {
    const ec_curve = ECCurves.secp256r1();
    const curve = ec_curve.getCurve();

    // curve 파라미터 추출
    this.ec_q = curve.getQ().toString(16);
    this.ec_a = curve.getA().toBigInteger().toString(16);
    this.ec_b = curve.getB().toBigInteger().toString(16);
    this.ec_gx = ec_curve.getG().getX().toBigInteger().toString(16);
    this.ec_gy = ec_curve.getG().getY().toBigInteger().toString(16);
    this.ec_n = ec_curve.getN().toString(16);
    this.rng = new SecureRandom();
    this.axiosInstance = AxiosInstance.getInstance();
  }

  generatePrivateKey() {
    // n = 곡선 차수
    let n = new BigInteger(this.ec_n, 16);
    let n1 = n.subtract(BigInteger.ONE);

    // n.bitLength() 의 랜덤 비트 => r
    let r = new BigInteger(n.bitLength(), this.rng);
    // r을 (n-1)로 나눈 나머지 + 1 => 실제 올바른 범위 값
    let rand = r.mod(n1).add(BigInteger.ONE);

    // (원본 코드 동일) 결국 r.toString(16)을 비밀키로 사용
    this.client_prikey = r.toString(16);
  }

  generatePublicKey() {
    let curve = this.get_curve();
    let G = this.get_G(curve);

    // private key를 BigInteger화
    let a = new BigInteger(this.client_prikey, 16);
    let P = G.multiply(a);

    // X, Y 좌표를 16진수로 얻음
    let pubkey_x = P.getX().toBigInteger().toString(16);
    let pubkey_y = P.getY().toBigInteger().toString(16);

    // 64자리가 되도록 0 패딩
    if (pubkey_x.length < 64) {
      pubkey_x = pubkey_x.padStart(64, "0");
    }
    if (pubkey_y.length < 64) {
      pubkey_y = pubkey_y.padStart(64, "0");
    }

    this.client_pubkey = pubkey_x + pubkey_y;
  }

  generateClientCalKey(pubkey_x, pubkey_y) {
    var curve = this.get_curve();
    var P = new ECPointFp(
      curve,
      curve.fromBigInteger(new BigInteger(pubkey_x, 16)),
      curve.fromBigInteger(new BigInteger(pubkey_y, 16))
    );
    var a = new BigInteger(this.client_prikey, 16);
    var S = P.multiply(a);

    var calkey_x = S.getX().toBigInteger().toString(16);
    var calkey_y = S.getY().toBigInteger().toString(16);

    if (calkey_x.length < 64) {
      var zlen = 64 - calkey_x.length;
      for (i = 0; i < zlen; i++) {
        calkey_x = "0" + calkey_x;
      }
    }

    if (calkey_y.length < 64) {
      var zlen = 64 - calkey_y.length;
      for (i = 0; i < zlen; i++) {
        calkey_y = "0" + calkey_y;
      }
    }

    this.client_calkey = calkey_x + calkey_y;
  }

  generateAuth(login_id, login_pwd, login_key) {
    var jsonObj = { login_id: login_id, login_pwd: login_pwd };
    var jsonStr = JSON.stringify(jsonObj);

    var user_data = this.encrypt_data(jsonStr);

    var req_data = "user_data=" + user_data + "&login_key=" + login_key;

    return req_data;
  }

  encrypt_data(data) {
    var passni_key = CryptoJS.enc.Hex.parse(
      this.client_calkey.substring(0, 64)
    );
    var passni_iv = CryptoJS.enc.Hex.parse(
      this.client_calkey.substring(64, 96)
    );

    var byte_data = CryptoJS.SEED.encrypt(data, passni_key, {
      iv: passni_iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.AnsiX923,
    });

    var encrypt_data = byte_data.ciphertext.toString();

    return encrypt_data;
  }

  get_curve() {
    return new ECCurveFp(
      new BigInteger(this.ec_q, 16),
      new BigInteger(this.ec_a, 16),
      new BigInteger(this.ec_b, 16)
    );
  }

  get_G(curve) {
    return new ECPointFp(
      curve,
      curve.fromBigInteger(new BigInteger(this.ec_gx, 16)),
      curve.fromBigInteger(new BigInteger(this.ec_gy, 16))
    );
  }

  loginCryption(encryptedData, privateKey) {
    const buffer = Buffer.from(encryptedData, "base64");
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      buffer
    );
    return decrypted.toString("utf8");
  }

  async action() {
    if (!this.client_pubkey) {
      return Promise.reject("Public Key is not generated");
    }
    const { agt_id, agt_url, agt_r } = await this.axiosInstance.initialBegin();
    const login_key = await this.axiosInstance.initialLing(
      agt_id,
      agt_url,
      agt_r
    );
    const { svr_qx, svr_qy } = await this.axiosInstance.initKey(
      this.client_pubkey
    );
    this.generateClientCalKey(svr_qx, svr_qy);

    console.log("Private Key:", this.client_prikey);
    console.log("Public Key:", this.client_pubkey);
    console.log("login_key:", login_key);
    console.log("Server Key:", svr_qx, svr_qy);
    console.log("Client Cal Key:", this.client_calkey);

    const req_data = this.generateAuth(
      "hometogo0625",
      "sessy5295!!",
      login_key
    );
    const data = await this.axiosInstance.auth(req_data);
    const msgSend = await this.axiosInstance.sendAuthMSG("sms", login_key);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter the verification code: ", async (crt_no) => {
      try {
        console.log("Verification Code:", crt_no);
        const verifyResponse = await this.axiosInstance.verifyMSG(
          crt_no,
          login_key
        );
        console.log("Verification Response:", verifyResponse);
        const { param1, param2 } = await this.axiosInstance.getPNI(login_key);
        const newpw = this.loginCryption(param1, param2);
        console.log("Encrypted Password:", param1);
        console.log("RSA Private Key:", param2);
        console.log("New Password:", newpw);
      } catch (error) {
        console.error("Error during verification:", error);
      } finally {
        rl.close();
      }
    });
  }
}

const AxiosInstance = (function () {
  let instance;

  function createInstance() {
    const jar = new tough.CookieJar();
    const client = wrapper(
      axios.create({
        withCredentials: true,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        },
        jar: jar,
      })
    );

    return {
      client: client,
      jar: jar,
      async initialBegin() {
        const { data: html } = await client.get(
          "https://myetl.snu.ac.kr/login"
        );

        const $ = cheerio.load(html);
        const agt_id = $("input[name=agt_id]").val();
        const agt_url = $("input[name=agt_url]").val();
        const agt_r = $("input[name=agt_r]").val();

        return { agt_id, agt_url, agt_r };
      },
      async initialLing(agt_id, agt_url, agt_r) {
        const { data: html } = await client.post(
          "https://nsso.snu.ac.kr/sso/usr/login/link",
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

        const { data: html2 } = await client.post(
          "https://etl.snu.ac.kr/xn-sso/gw-cb.php"
        );

        const { param1, param2 } = extractLoginCryptionParams(html2);

        return { param1, param2 };
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

function loginCryption(encryptedData, privateKey) {
  try {
    // Base64로 인코딩된 암호화된 데이터를 디코딩하여 바이트 배열로 변환
    const encryptedBytes = forge.util.decode64(encryptedData);

    // 개인 키를 PEM 형식으로 변환
    const pemPrivateKey = forge.pki.privateKeyFromPem(privateKey);

    // RSA/ECB/PKCS1 패딩을 사용하여 데이터 복호화
    const decryptedBytes = pemPrivateKey.decrypt(
      encryptedBytes,
      "RSAES-PKCS1-V1_5"
    );

    // 복호화된 바이트 배열을 UTF-8 문자열로 변환하여 반환
    return forge.util.decodeUtf8(decryptedBytes);
  } catch (error) {
    console.error("복호화 중 오류 발생:", error);
    return null;
  }
}

//const auth = new LoginAuth();
// auth.generatePrivateKey();
//auth.generatePublicKey();
//auth.action();
//auth.generatePrivateKey();
//console.log("Private Key:", auth.client_prikey);
//auth.generatePublicKey();
//console.log("Public Key:", auth.client_pubkey);

var encryptedData =
  "Pt4BI9dFjeWrN+SWwEzhfNw4z/ZMv5wt5ElaWDWPxq+wtTZ+Ug1+RNvRlga1KgjF0ha6/H3BC2Ito5S1MccRogcbb+ZRGGl0TvRl2yv8HTkjVcCGVL+6ZicFl2Wt/W6HrK2FEjgYbsXqO+YnmbbFHb+ffhNZ2hS0DgUIUu1RqQpryUS3I+gVydrtJEASa97/KVvHt8cjGOlOB1lfNkeA5atmn3F+6zjBil3F8CseWOEpzs1VN2QVJ7nWqfPFagrQJqt6nsnalziTK0etQO/FLhd48Ms4N2uV48PkDDQoRsrozaKGLKa65KH+kR3X6UzGlgS/4FYOvOAwH6rgyWtEAg==";
var privateKey = `-----BEGIN RSA PRIVATE KEY-----MIIEpAIBAAKCAQEAzftR1fqrvYrTzXp/FKM4uK53l7x1kridTihhP1NWS9XvNi08zW9CT0ATpDUhB0E/R5W2izOlNHHNaHjq/X0ctBD5jA9TAl26WhyOMF0spZVV+9nSo3k5P9RPPxTz6Kop3dXsa5SMcIK5+E/D/W6WUyhgQyc2NKVgne8LlJ8m4yTaWwL5Dzi0RFk1qO/xdkYnSPrzLtGxwcCfJLadfBYIvQOl3sOQ2cRLlamhYGrnRuOMsQlVOb49s2fj9C3/D5d4mTpgCumz5TJRY5+UORHQjfRHxSNh6NSczvR9OzkQH1XGVynL1BHGp7BmP5s8qkq5NSYB+p1Jn/FpNyzP6y4PqwIDAQABAoIBADUh0803WN+OlO3W4Drpk3MIBe9M/KL5HhKQFe2oyITNTWQTLTDstxUMOUTNM5TUfscvViP4EXBCvrJpJmx2vlWwXz6CoW3l0XD3FrJhBmg76i8J0+y5E0xkroBeHkBwzFXdnZtueP94qRHlOXAA+6O9sX8A+VmBIzf59mnC19wVKd+SE+ErGkErOIxBp1dDjlMftkfAkaR7aCQMXU0f1pqLJk7HsbWCZQSRCXTVRqPA8MoHydRj9lzNeHb9EqtITUVtmibPAx89E+IQyowNZ/Hl92SAJNbyQtVUuqzMImH2Hn8apL6JmwJDD9Bz6T1LiJWVCTJVUiflPrsJolqQ3ykCgYEA8iWDgE8+Q2WkJko52ys5LeRq0oa5BbumTR2kLLdXaGDYYttvu1gr38IuXg3iOJa9X8RalJ6nCUksGHcw+h88+5OUNtBelx24HN7YnR/YgQ0Cu3hPo7qwNWUt/NrXyh/3rmtROyubOcwb/ujKkRlMHRe2jaAov0HdCn3PZZsO0X0CgYEA2cQig64Et4ZxrQ0tB6Kz2JjSjkXktXUaggKkeodV+WHxP9093lywciQ5vKdXXj7h6m4a3RKi3ILEu6gIdTEfWEXjtdwTeu/3ybWyCvgXOQLUiz+F5oGBX3gT0uZ6ZMhfxHZcZ/7Co0WksmW8TpE9hH1MlR5Aj4704JcLWNWbrkcCgYEA6JpUiaqVWtSGLCndDcWldYoXewfjL7ij9SvmCvZLRn7RHZVA7SuzaYv0UnDvwAA9BYNup5kHR4o8i3vjVkEvqVKIa2cZlfv8Ye9HERgIN18yIrddeR/aKFB7LotiAk1W9Pst2rL2tzx0IBeqjltInCGtQLp6qc4w8OUNlsKuJ1kCgYA25+j74oh17YQD6eqMnk1SM1YDYUQFLH1+gkQOUMkwk61MOPA8fIpQfSnBkz/IF3rGrPRBAU3m42HPHtLjGXuZuiVr2Q1gVdjYFuPJODxCt5/3bBDKyaRg+dmlt07s0kizNFSgM+/HUuvvvw73kE8+dIk2n+YPTDAZ4HuP7mvOSQKBgQDCHy+f+x+XrgtYXyux30THAKoiSSVe9J+YaNOEXQOgIdc9Q4M2I4r+xaWCSMt4tckfT3BlJy8COOsvPyF4YfQKJAiDbkXK5/h2o3dYxN0K2QVsvzPGcmhHBq7eDD6punQhUT383EJ4AbeBoJAg3/4mqDZy+Lb23sPapN8HL4xfaA==-----END RSA PRIVATE KEY-----`;

console.log(loginCryption(encryptedData, privateKey));

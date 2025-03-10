import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar, Cookie } from "tough-cookie";

class ETLApiInstance {
  private static instance: ETLApiInstance;
  private axiosInstance: any;
  private jar: CookieJar;

  private csrf_token: string;

  private constructor() {
    this.jar = new CookieJar();
    this.csrf_token = "";
    this.axiosInstance = wrapper(
      axios.create({
        baseURL: "https://myetl.snu.ac.kr",
        withCredentials: true,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        },
        jar: this.jar,
      })
    );
    this.axiosInstance.interceptors.response.use((response: any) => {
      const setCookieHeader = response.headers["set-cookie"];
      if (setCookieHeader) {
        setCookieHeader.forEach((cookie: string) => {
          const parsedCookie = Cookie.parse(cookie);
          if (parsedCookie && parsedCookie.key === "_csrf_token") {
            this.csrf_token = parsedCookie.value;
          }
        });
      }
      return response;
    });
  }

  public async initialize() {
    await this.axiosInstance.get("/login/canvas");
    if (this.csrf_token) {
      return true;
    }
  }

  public async login(username: string, password: string) {
    if (!this.csrf_token) {
      throw new Error("CSUF token is not initialized");
    }
    const response = await this.axiosInstance.post(
      "/login/canvas",
      "utf8=✓&redirect_to_ssl=1&" +
        "authenticity_token=" +
        this.csrf_token +
        "&pseudonym_session[unique_id]=" +
        username +
        "&pseudonym_session[password]=" +
        password +
        "&pseudonym_session[remember_me]=0"
    );

    return response;
  }

  public async;

  static getInstance() {
    if (!ETLApiInstance.instance) {
      ETLApiInstance.instance = new ETLApiInstance();
    }
    return ETLApiInstance.instance;
  }
}

const instance = ETLApiInstance.getInstance();
instance.initialize().then(() => {
  instance
    .login("2023-15725", "V5xErZMESuJAMUwT5IEoBXPjBlc77Qbu")
    .then((response) => {
      console.log(response);
    });
});

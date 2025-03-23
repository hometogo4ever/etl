import axios, { AxiosInstance, AxiosResponse } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar, Cookie } from "tough-cookie";
import { Course } from "../types/Courses.js";
import { Notification, PlannableNotification } from "../types/Notification.js";
import { StudentModule } from "../types/Module.js";
import { ModuleGroup } from "../types/ModuleGroup.js";
import { AssignmentGroup } from "../types/AssignmentGroup.js";
import https from "https";

class ETLApiInstance {
  private static instance: ETLApiInstance;
  private axiosInstance: AxiosInstance;

  private isLogined: boolean = false;
  private jar: CookieJar;

  private csrf_token: string;

  public getToken() {
    return this.csrf_token;
  }

  private constructor() {
    this.csrf_token = "";
    this.jar = new CookieJar();
    this.axiosInstance = axios.create({
      baseURL: "https://myetl.snu.ac.kr",
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

    this.axiosInstance.interceptors.response.use(
      async (response) => {
        const url = response.config.url || "";
        const setCookie = response.headers["set-cookie"];

        if (setCookie) {
          for (const cookie of setCookie) {
            try {
              const parsedCookie = Cookie.parse(cookie);
              if (parsedCookie && parsedCookie.key === "_csrf_token") {
                this.csrf_token = parsedCookie.value;
              }
              await this.jar.setCookie(cookie, url);
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
          const base = response.config.baseURL || "";
          const fullRequestUrl = new URL(response.config.url!, base).toString();
          const redirectedUrl = new URL(location, fullRequestUrl).toString();
          console.log("[리디렉션 발생]", redirectedUrl);

          const newConfig = {
            ...response.config,
            url: redirectedUrl,
            baseURL: undefined, // remove baseURL to avoid double prefix
          };

          return this.axiosInstance(newConfig);
        }

        return response;
      },
      (error) => {
        console.error("[응답 에러]", error.message);
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.request.use(async (config) => {
      const cookieStr = await this.jar.getCookieString(config.url || "");
      config.headers["Cookie"] = cookieStr;
      console.log("[요청 쿠키]", config.url, cookieStr);
      return config;
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
    this.isLogined = true;
    return response;
  }

  public async getCourses(): Promise<Course[]> {
    if (!this.csrf_token) {
      throw new Error("CSUF token is not initialized");
    }
    const response: AxiosResponse<Course[]> = await this.axiosInstance.get(
      "/api/v1/dashboard/dashboard_cards"
    );
    return response.data;
  }

  public async getAlarms(): Promise<PlannableNotification[]> {
    if (!this.csrf_token) {
      throw new Error("CSUF token is not initialized");
    }
    const response: AxiosResponse<PlannableNotification[]> =
      await this.axiosInstance.get("/api/v1/planner/items");
    return response.data;
  }

  public async getNotifications(course_id: string): Promise<Notification[]> {
    if (!this.csrf_token) {
      throw new Error("CSUF token is not initialized");
    }
    const response: AxiosResponse<Notification[]> =
      await this.axiosInstance.get(
        `/api/v1/announcements?per_page=10&context_codes[]=course_${course_id}
        &page=1
        &active_only=true
        &include[]=sections
        &include[]=sections_user_count`
      );
    return response.data;
  }

  public async getCourseModules(course_id: string): Promise<ModuleGroup[]> {
    if (!this.csrf_token) {
      throw new Error("CSUF token is not initialized");
    }
    const response: AxiosResponse<ModuleGroup[]> = await this.axiosInstance.get(
      `/api/v1/courses/${course_id}/modules`
    );
    return response.data;
  }

  public async getModuleItems(
    course_id: string,
    module_id: string
  ): Promise<StudentModule[]> {
    if (!this.csrf_token) {
      throw new Error("CSUF token is not initialized");
    }
    const response: AxiosResponse<StudentModule[]> =
      await this.axiosInstance.get(
        `/api/v1/courses/${course_id}/modules/${module_id}/items`
      );
    return response.data;
  }

  public async getAssignments(course_id: string): Promise<AssignmentGroup[]> {
    if (!this.csrf_token) {
      throw new Error("CSUF token is not initialized");
    }
    const response: AxiosResponse<AssignmentGroup[]> =
      await this.axiosInstance.get(
        `/api/v1/courses/${course_id}/assignment_groups`
      );
    return response.data;
  }

  public hasLogined(): boolean {
    return this.isLogined;
  }

  static getInstance() {
    if (!ETLApiInstance.instance) {
      ETLApiInstance.instance = new ETLApiInstance();
    }
    return ETLApiInstance.instance;
  }
}

export default ETLApiInstance;

import axios, { AxiosInstance, AxiosResponse } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar, Cookie } from "tough-cookie";
import { Course } from "../types/Courses";
import { Notification, PlannableNotification } from "../types/Notification";
import MyDatabase from "./db";
import * as cheerio from "cheerio";
import { Module } from "module";
import { StudentModule } from "../types/Module";
import { ModuleGroup } from "../types/ModuleGroup";
import { AssignmentGroup } from "../types/AssignmentGroup";

class ETLApiInstance {
  private static instance: ETLApiInstance;
  private axiosInstance: AxiosInstance;
  private db: MyDatabase;
  private jar: CookieJar;

  private csrf_token: string;

  public getToken() {
    return this.csrf_token;
  }

  private constructor() {
    this.jar = new CookieJar();
    this.db = new MyDatabase();

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

  static getInstance() {
    if (!ETLApiInstance.instance) {
      ETLApiInstance.instance = new ETLApiInstance();
    }
    return ETLApiInstance.instance;
  }
}

const instance = ETLApiInstance.getInstance();
instance.initialize().then(() => {
  instance.login("2023-15725", "PU1LNUbuRPPRvcsodIgxzD9XZLx2m4oA");
});

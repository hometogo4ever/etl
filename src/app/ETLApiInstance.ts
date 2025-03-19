import axios, { AxiosInstance, AxiosResponse } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar, Cookie } from "tough-cookie";
import { Course } from "./types/Courses";
import { Notification, PlannableNotification } from "./types/Notification";
import MyDatabase from "./db";

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

  public async test() {
    try {
      const courses = await this.getCourses();
      console.log("TEST 1 : SUCCESS");
      console.log(courses.map((course) => course.originalName));
    } catch (e) {
      console.log("TEST 1 : FAILED");
      return;
    }

    try {
      const alarms = await this.getAlarms();
      console.log("TEST 2 : SUCCESS");
      console.log(alarms.map((alarm) => alarm.context_name));
    } catch (e) {
      console.log("TEST 2 : FAILED (", e, ")");
      return;
    }

    try {
      const courses = await this.getCourses();
      for (const course of courses) {
        const notifications = await this.getNotifications(course.id);
        console.log(notifications.map((notification) => notification.title));
      }
      console.log("TEST 3 : SUCCESS");
    } catch (e) {
      console.log("TEST 3 : FAILED (", e, ")");
      return;
    }

    try {
      // DB Test
      const courses = await this.getCourses();

      for (const course of courses) {
        this.db.insertCourse(course);
        const notifications = await this.getNotifications(course.id);
        for (const notification of notifications) {
          this.db.insertNotification(notification);
        }
      }
      console.log("TEST 4 : SUCCESS");
    } catch (e) {
      console.log("TEST 4 : FAILED (", e, ")");
      return;
    }

    console.log("ALL TESTS PASSED");
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
  instance
    .login("2023-15725", "bcx8nAPlCN1ctnXAgKk5yc4PcvNvREjN")
    .then((response) => {
      instance.test();
    });
});

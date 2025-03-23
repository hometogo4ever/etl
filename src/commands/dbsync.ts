import MyDatabase from "../app/services/db.js";
import ETLApiInstance from "../app/services/ETLApiInstance.js";
import { AssignmentGroup } from "../app/types/AssignmentGroup.js";
import { Course } from "../app/types/Courses.js";
import { StudentModule } from "../app/types/Module.js";
import { ModuleGroup } from "../app/types/ModuleGroup.js";
import { Notification } from "../app/types/Notification.js";

class DataSyncManager {
  private static instance: DataSyncManager;
  private etlApiInstance: ETLApiInstance;
  private db: MyDatabase;

  private constructor(etlApiInstance: ETLApiInstance, db: MyDatabase) {
    this.etlApiInstance = etlApiInstance;
    this.db = db;

    if (!this.etlApiInstance.hasLogined()) {
      console.log("ETLApiInstance is not logined, please login first");
    }
  }

  public static getInstance(etlApiInstance: ETLApiInstance, db: MyDatabase) {
    if (!DataSyncManager.instance) {
      DataSyncManager.instance = new DataSyncManager(etlApiInstance, db);
    }
    return DataSyncManager.instance;
  }

  public async syncCourses(): Promise<Course[]> {
    const courses = await this.etlApiInstance.getCourses();
    for (const course of courses) {
      this.db.insertCourse(course);
    }
    return courses;
  }

  public async syncNotifications(course_id: string): Promise<Notification[]> {
    const notifications = await this.etlApiInstance.getNotifications(course_id);
    for (const notification of notifications) {
      this.db.insertNotification(notification);
    }
    return notifications;
  }

  public async syncModules(course_id: string): Promise<ModuleGroup[]> {
    const modules = await this.etlApiInstance.getCourseModules(course_id);
    for (const module of modules) {
      this.db.insertModuleGroup(module);
    }
    return modules;
  }

  public async syncModuleItems(
    course_id: string,
    module_id: string
  ): Promise<StudentModule[]> {
    const items = await this.etlApiInstance.getModuleItems(
      course_id,
      module_id
    );
    for (const item of items) {
      this.db.insertStudentModule(item);
    }
    return items;
  }

  public async syncAssignments(course_id: string): Promise<AssignmentGroup[]> {
    const assignments = await this.etlApiInstance.getAssignments(course_id);
    for (const assignment of assignments) {
      this.db.insertAssignmentGroup(assignment);
    }
    return assignments;
  }

  public async syncAll(): Promise<void> {
    const courses = await this.syncCourses();
    for (const course of courses) {
      await this.syncNotifications(course.id);
      const module_groups = await this.syncModules(course.id);
      for (const module_group of module_groups) {
        await this.syncModuleItems(course.id, module.id);
      }
      await this.syncAssignments(course.id);
    }
  }

  public async resetTable(): Promise<void> {
    this.db.deleteAll();
  }
}

export default DataSyncManager;

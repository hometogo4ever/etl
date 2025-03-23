import * as vscode from "vscode";
import { CourseInfoType, CourseItem } from "./courseInfoItem.js";
import { Course } from "../types/Courses.js";
import MyDatabase from "../services/db.js";
import {
  AssignmentGroupItem,
  AssignmentItem,
  LearningModuleGroup,
  LearningModuleItem,
  NotificationItem,
} from "./nextItems.js";
import { StudentModule } from "../types/Module.js";
import { load } from "cheerio";
import ETLApiInstance from "../services/ETLApiInstance.js";

// These functions are used to load the next level of the tree view.
// loadAfter : (courseId: string, additionalInfo: string) => CourseItem[]

// 1. Course Name => CourseItems

const db = MyDatabase.getInstance();
const etl = ETLApiInstance.getInstance();

export function loadCourseInfo(course: Course): CourseItem[] {
  return [
    new CourseItem(
      vscode.TreeItemCollapsibleState.Collapsed,
      CourseInfoType.COURSE_INFO,
      () => {
        return [];
      },
      course
    ),
    new CourseItem(
      vscode.TreeItemCollapsibleState.Collapsed,
      CourseInfoType.NOTIFICATION,
      loadNotification,
      course
    ),
    new CourseItem(
      vscode.TreeItemCollapsibleState.Collapsed,
      CourseInfoType.LEARNING_MODULES,
      loadLearningModules,
      course
    ),
    new CourseItem(
      vscode.TreeItemCollapsibleState.Collapsed,
      CourseInfoType.ASSIGNMENTS,
      loadAssignments,
      course
    ),
    new CourseItem(
      vscode.TreeItemCollapsibleState.Collapsed,
      CourseInfoType.FILES,
      () => {
        return [];
      }
    ),
  ];
}

// 2. CourseItem -> Notification

export const loadNotification = (courseId: string): CourseItem[] => {
  const notifications = db.getNotification(courseId);
  return notifications.map((notification) => {
    return new NotificationItem(
      vscode.TreeItemCollapsibleState.Collapsed,
      notification,
      courseId
    );
  });
};

// 3. CourseItem -> Learning Modules Groups

export const loadLearningModules = (courseId: string): CourseItem[] => {
  const moduleGroups = db.getModules(courseId);
  return moduleGroups.map((moduleGroup) => {
    return new LearningModuleGroup(
      vscode.TreeItemCollapsibleState.Expanded,
      moduleGroup,
      courseId,
      loadLearningModule
    );
  });
};

// 4. Learning Modules Group -> Learning Modules

export const loadLearningModule = (
  courseId: string,
  additionalInfo?: string
): CourseItem[] => {
  if (!additionalInfo) {
    return [];
  }
  const modules = db.getModuleItems(courseId, additionalInfo);
  return modules.map((module) => {
    return new LearningModuleItem(
      vscode.TreeItemCollapsibleState.Collapsed,
      module,
      courseId,
      additionalInfo
    );
  });
};

// 5. CourseItem -> Assignment Groups

export const loadAssignments = (courseId: string): CourseItem[] => {
  const assignmentGroups = db.getAssignments(courseId);
  return assignmentGroups.map((assignmentGroup) => {
    return new AssignmentGroupItem(
      vscode.TreeItemCollapsibleState.Collapsed,
      assignmentGroup,
      courseId
    );
  });
};

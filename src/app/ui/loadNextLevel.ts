import * as vscode from "vscode";
import { CourseInfoType, CourseItem } from "./courseInfoItem.js";
import { Course } from "../types/Courses.js";
import MyDatabase from "../services/db.js";
import {
  AssignmentGroupItem,
  AssignmentItem,
  FileItem,
  FolderItem,
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
const etl = ETLApiInstance.getInstance();

export function loadCourseInfo(course: Course): CourseItem[] {
  return [
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
    new FolderItem(
      vscode.TreeItemCollapsibleState.Collapsed,
      undefined,
      loadFolderItems,
      course.id
    ),
  ];
}

// 2. CourseItem -> Notification

export const loadNotification = async (courseId: string) => {
  const notifications = await etl.getNotifications(courseId);
  return notifications.map((notification) => {
    return new NotificationItem(
      vscode.TreeItemCollapsibleState.None,
      notification,
      courseId
    );
  });
};

// 3. CourseItem -> Learning Modules Groups

export const loadLearningModules = async (courseId: string) => {
  const moduleGroups = await etl.getCourseModules(courseId);
  return moduleGroups.map((moduleGroup) => {
    return new LearningModuleGroup(
      vscode.TreeItemCollapsibleState.Collapsed,
      moduleGroup,
      courseId,
      loadLearningModule
    );
  });
};

// 4. Learning Modules Group -> Learning Modules

export const loadLearningModule = async (
  courseId: string,
  additionalInfo?: string
) => {
  if (!additionalInfo) {
    return [];
  }
  const modules = await etl.getModuleItems(courseId, additionalInfo);
  return modules.map((module) => {
    return new LearningModuleItem(
      vscode.TreeItemCollapsibleState.None,
      module,
      courseId,
      additionalInfo
    );
  });
};

// 5. CourseItem -> Assignment Groups

export const loadAssignments = async (courseId: string) => {
  const assignmentGroups = await etl.getAssignments(courseId);
  return assignmentGroups.map((assignmentGroup) => {
    return new AssignmentGroupItem(
      vscode.TreeItemCollapsibleState.Collapsed,
      assignmentGroup,
      courseId
    );
  });
};

export const loadRoot = async (courseId: string) => {
  const folder = await etl.getRootFolder(courseId);
  return folder;
};

export const loadFolderItems = async (
  courseId: string,
  additionalInfo?: string
) => {
  console.log("Loading Folder Items", courseId, additionalInfo);
  if (!additionalInfo) {
    return [];
  }

  const folders = await etl.getFolderFolders(additionalInfo);
  const files = await etl.getFolderFiles(additionalInfo);
  const foldersItems = folders.map((folder) => {
    return new FolderItem(
      vscode.TreeItemCollapsibleState.Collapsed,
      folder,
      loadFolderItems,
      courseId
    );
  });

  const filesItems = files.map((file) => {
    return new FileItem(vscode.TreeItemCollapsibleState.None, file, courseId);
  });
  return [...foldersItems, ...filesItems];
};

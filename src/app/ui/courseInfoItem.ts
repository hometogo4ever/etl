import * as vscode from "vscode";
import { Course } from "../types/Courses.js";
import * as path from "path";

export enum CourseInfoType {
  COURSE_INFO = "Course Info",
  NOTIFICATION = "공지사항",
  LEARNING_MODULES = "학습모듈",
  ASSIGNMENTS = "과제",
  FILES = "파일",
  FOLDERS = "폴더",
}

export class CourseItem extends vscode.TreeItem {
  public courseId?: string;
  public additionalInfo?: string;

  constructor(
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly type: CourseInfoType,
    public loadAfter: (
      courseId: string,
      additionalInfo?: string
    ) => Promise<CourseItem[]>,
    public readonly course?: Course
  ) {
    const label =
      type === CourseInfoType.COURSE_INFO && course
        ? course.originalName
        : type;
    super(label, collapsibleState);
    if (course) {
      if (type === CourseInfoType.COURSE_INFO) {
        this.tooltip = `${course.courseCode} - ${course.term}`;
      }
      this.description = course.term;
    }
    this.iconPath = this.decideIconPath(type);
    this.courseId = course?.id;
  }

  private decideIconPath(type: CourseInfoType) {
    switch (type) {
      case CourseInfoType.COURSE_INFO:
        console.log(
          "File PAth: ",
          path.join(
            __filename,
            "..",
            "..",
            "..",
            "resources",
            "light",
            "course.svg"
          )
        );
        return {
          light: path.join(
            __filename,
            "..",
            "..",
            "..",
            "resources",
            "light",
            "course.svg"
          ),
          dark: path.join(
            __filename,
            "..",
            "..",
            "..",
            "resources",
            "dark",
            "course.svg"
          ),
        };
      case CourseInfoType.NOTIFICATION:
        return {
          light: path.join(
            __filename,
            "..",
            "..",
            "..",
            "resources",
            "light",
            "notification.svg"
          ),
          dark: path.join(
            __filename,
            "..",
            "..",
            "..",
            "resources",
            "dark",
            "notification.svg"
          ),
        };
      case CourseInfoType.LEARNING_MODULES:
        return {
          light: path.join(
            __filename,
            "..",
            "..",
            "..",
            "resources",
            "light",
            "learning_modules.svg"
          ),
          dark: path.join(
            __filename,
            "..",
            "..",
            "..",
            "resources",
            "dark",
            "learning_modules.svg"
          ),
        };
      case CourseInfoType.ASSIGNMENTS:
        return {
          light: path.join(
            __filename,
            "..",
            "..",
            "..",
            "resources",
            "light",
            "assignments.svg"
          ),
          dark: path.join(
            __filename,
            "..",
            "..",
            "..",
            "resources",
            "dark",
            "assignments.svg"
          ),
        };
      case CourseInfoType.FILES:
        return {
          light: path.join(
            __filename,
            "..",
            "..",
            "..",
            "resources",
            "light",
            "files.svg"
          ),
          dark: path.join(
            __filename,
            "..",
            "..",
            "..",
            "resources",
            "dark",
            "files.svg"
          ),
        };

      case CourseInfoType.FOLDERS:
        return {
          light: path.join(
            __filename,
            "..",
            "..",
            "..",
            "resources",
            "light",
            "folders.svg"
          ),
          dark: path.join(
            __filename,
            "..",
            "..",
            "..",
            "resources",
            "dark",
            "folders.svg"
          ),
        };
    }
  }
}

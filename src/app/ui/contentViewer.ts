import * as vscode from "vscode";
import { Course } from "../types/Courses.js";
import * as path from "path";
import { CourseInfoType, CourseItem } from "./courseInfoItem.js";
import { loadCourseInfo } from "./loadNextLevel.js";

/**
 * What Course Information need?
 *
 * 1. Course Name (Root)
 * 2. Course Info
 * 3. Notification
 * 4. Learning Modules
 * 5. Assignments
 * 6. Files
 *
 */

export class CourseProvider implements vscode.TreeDataProvider<CourseItem> {
  constructor(private courses: Course[]) {}

  getTreeItem(element: CourseItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: CourseItem): Thenable<CourseItem[]> {
    if (!element) {
      return Promise.resolve([]);
    }

    if (element.type === CourseInfoType.COURSE_INFO && element.course) {
      return Promise.resolve(loadCourseInfo(element.course));
    } else {
      return Promise.resolve(
        element.loadAfter(element.courseId!, element.additionalInfo!)
      );
    }
  }
}

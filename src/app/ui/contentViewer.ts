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
      // 🟡 루트 노드: Course 목록 보여주기
      const courseItems = this.courses.map(
        (course) =>
          new CourseItem(
            vscode.TreeItemCollapsibleState.Collapsed,
            CourseInfoType.COURSE_INFO,
            async (courseId: string) => {
              const course = this.courses.find((c) => c.id === courseId);
              if (!course) {
                return [];
              }
              return loadCourseInfo(course!);
            },
            course
          )
      );
      return Promise.resolve(courseItems);
    }

    if (element.type === CourseInfoType.COURSE_INFO && element.course) {
      return Promise.resolve(loadCourseInfo(element.course));
    } else {
      console.log("Course Info: ", element.courseId);
      return Promise.resolve(
        element.loadAfter(element.courseId!, element.additionalInfo!)
      );
    }
  }
}

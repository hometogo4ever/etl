import * as vscode from "vscode";
import * as path from "path";
import { Course } from "../types/Courses.js";
import { Notification } from "../types/Notification.js";
import { CourseInfoType, CourseItem } from "./courseInfoItem.js";
import { ModuleGroup } from "../types/ModuleGroup.js";
import { StudentModule } from "../types/Module.js";
import { AssignmentGroup } from "../types/AssignmentGroup.js";
import { Assignment } from "../types/Assignment.js";

export class NotificationItem extends CourseItem {
  constructor(
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly notification: Notification,
    courseId: string
  ) {
    super(collapsibleState, CourseInfoType.NOTIFICATION, () => {
      // My Custom Logic
      return [];
    });
    this.label = notification.title;
    this.tooltip = notification.created_at;
    this.courseId = courseId;
    this.iconPath =
      notification.read_state == "read"
        ? {
            light: path.join(
              __filename,
              "..",
              "..",
              "..",
              "resources",
              "light",
              "note_seen.svg"
            ),
            dark: path.join(
              __filename,
              "..",
              "..",
              "..",
              "resources",
              "dark",
              "note_seen.svg"
            ),
          }
        : {
            light: path.join(
              __filename,
              "..",
              "..",
              "..",
              "resources",
              "light",
              "note_unseen.svg"
            ),
            dark: path.join(
              __filename,
              "..",
              "..",
              "..",
              "resources",
              "dark",
              "note_unseen.svg"
            ),
          };
  }
}

export class LearningModuleGroup extends CourseItem {
  constructor(
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly moduleGroup: ModuleGroup,
    courseId: string,
    public readonly loadAfter: (
      courseId: string,
      additionalInfo?: string
    ) => CourseItem[]
  ) {
    super(collapsibleState, CourseInfoType.LEARNING_MODULES, loadAfter);
    this.label = moduleGroup.name;
    this.additionalInfo = moduleGroup.id;
    this.courseId = courseId;
    this.iconPath = {
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
  }
}

export class LearningModuleItem extends CourseItem {
  constructor(
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly module: StudentModule,
    courseId: string,
    moduleId: string
  ) {
    super(collapsibleState, CourseInfoType.LEARNING_MODULES, () => {
      // My Custom Logic
      return [];
    });
    this.label = module.title;
    this.courseId = courseId;
    this.additionalInfo = moduleId;
    this.iconPath = {
      light: path.join(
        __filename,
        "..",
        "..",
        "..",
        "resources",
        "light",
        "note_seen.svg"
      ),
      dark: path.join(
        __filename,
        "..",
        "..",
        "..",
        "resources",
        "dark",
        "note_seen.svg"
      ),
    };
  }
}

export class AssignmentGroupItem extends CourseItem {
  constructor(
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly assignmentGroup: AssignmentGroup,
    courseId: string
  ) {
    const loadAfter = (courseId: string): CourseItem[] => {
      const assignments = this.assignmentGroup.assignments;
      return assignments.map((assignment) => {
        return new AssignmentItem(
          vscode.TreeItemCollapsibleState.Collapsed,
          assignment,
          courseId,
          this.additionalInfo!
        );
      });
    };

    super(collapsibleState, CourseInfoType.ASSIGNMENTS, loadAfter);
    this.label = assignmentGroup.name;
    this.courseId = courseId;
    this.additionalInfo = assignmentGroup.id;
    this.iconPath = {
      light: path.join(
        __filename,
        "..",
        "..",
        "..",
        "resources",
        "light",
        "note_seen.svg"
      ),
      dark: path.join(
        __filename,
        "..",
        "..",
        "..",
        "resources",
        "dark",
        "note_seen.svg"
      ),
    };
  }
}

export class AssignmentItem extends CourseItem {
  constructor(
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly assignment: Assignment,
    courseId: string,
    assignmentId: string
  ) {
    super(collapsibleState, CourseInfoType.ASSIGNMENTS, () => {
      // My Custom Logic
      return [];
    });
    this.courseId = courseId;
    this.additionalInfo = assignmentId;
    this.label = assignment.name;
    this.iconPath = {
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
  }
}

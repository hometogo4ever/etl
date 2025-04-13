import * as vscode from "vscode";
import * as path from "path";
import { Course } from "../types/Courses.js";
import { Notification } from "../types/Notification.js";
import { CourseInfoType, CourseItem } from "./courseInfoItem.js";
import { ModuleGroup } from "../types/ModuleGroup.js";
import { StudentModule } from "../types/Module.js";
import { AssignmentGroup } from "../types/AssignmentGroup.js";
import { Assignment } from "../types/Assignment.js";
import { loadNotificationView } from "./loadWebView.js";
import { ETLFile } from "../types/File.js";
import { ETLFolder } from "../types/Folder.js";
import { loadRoot } from "./loadNextLevel.js";

export class NotificationItem extends CourseItem {
  constructor(
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly notification: Notification,
    courseId: string
  ) {
    super(collapsibleState, CourseInfoType.NOTIFICATION, async () => {
      return [];
    });
    this.command = {
      command: "etl.openNotification",
      title: "Open Notification",
      arguments: [courseId, this.notification.id],
    };
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
    ) => Promise<CourseItem[]>
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
    super(collapsibleState, CourseInfoType.LEARNING_MODULES, async () => {
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
    const loadAfter = (courseId: string): Promise<CourseItem[]> => {
      const assignments = this.assignmentGroup.assignments;
      return Promise.resolve(
        assignments.map((assignment) => {
          return new AssignmentItem(
            vscode.TreeItemCollapsibleState.None,
            assignment,
            courseId,
            this.additionalInfo!
          );
        })
      );
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
    super(collapsibleState, CourseInfoType.ASSIGNMENTS, async () => {
      // My Custom Logic
      return [];
    });
    this.command = {
      command: "etl.openAssignment",
      title: "Open Assignment",
      arguments: [courseId, assignment.id],
    };
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

export class FileItem extends CourseItem {
  constructor(
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly file: ETLFile,
    courseId: string
  ) {
    super(collapsibleState, CourseInfoType.FILES, async () => {
      // My Custom Logic
      return [];
    });
    console.log("Directory: ", courseId, this.file.id);
    this.command = {
      command: "etl.openFile",
      title: "Open File",
      arguments: [courseId.toString(), this.file.id.toString()],
    };
    this.additionalInfo = file.id;
    this.label = file.display_name;
    this.iconPath = {
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
  }
}

export class FolderItem extends CourseItem {
  constructor(
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly folder: ETLFolder | undefined,
    loadAfter: (
      courseId: string,
      additionalInfo?: string
    ) => Promise<CourseItem[]>,
    courseId?: string
  ) {
    super(collapsibleState, CourseInfoType.FOLDERS, loadAfter);
    if (!folder) {
      loadRoot(courseId!)
        .then((folder) => {
          this.additionalInfo = folder.id;
          this.label = "파일";
        })
        .catch((error) => {
          console.error("Error loading root folder:", error);
          this.additionalInfo = undefined;
          this.label = "Error loading folder";
        });
    } else {
      this.additionalInfo = folder.id;
      this.label = folder.name;
    }
    this.courseId = courseId;
    this.iconPath = {
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

import ETLApiInstance from "../services/ETLApiInstance";
import { getFilenameFromMeta } from "../services/MetaFS";
import { openVirtualWebview } from "../services/VirtualDoc";
import fs from "fs";
import path from "path";
import * as vscode from "vscode";
const cheerio = require("cheerio");

const etl = ETLApiInstance.getInstance();

export async function loadNotificationView(
  courseId: string,
  notificationId: string
) {
  console.log("Loading Notification View", courseId, notificationId);
  const notification = await etl.getNotificationWeb(courseId, notificationId);
  const $ = cheerio.load(notification);
  const title = $("head > title").text();
  const body = $("#content").html();
  const css = fs.readFileSync(
    path.join(__dirname, "..", "..", "resources", "style", "notification.css"),
    "utf-8"
  );

  openVirtualWebview(title, body, css);
}

export async function loadAssignmentView(
  courseId: string,
  assignmentId: string
) {
  const assignment = await etl.getAssignmentWeb(courseId, assignmentId);
  const $ = cheerio.load(assignment);
  const title = $("head > title").text();
  const body = $("#content").html();
  openVirtualWebview(title, body);
}

export async function loadFile(
  contextPath: string,
  courseId: string,
  fileId: string
) {
  const metaPath = path.join(contextPath, courseId, "meta.json");
  const fileName = await getFilenameFromMeta(metaPath, fileId);
  if (fileName) {
    const fileDir = path.join(contextPath, courseId, fileName);
    if (fs.existsSync(fileDir)) {
      return await vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.file(fileDir)
      );
    }
  }
  const fileDir = await etl.getFile(contextPath, courseId, fileId);
  console.log("File Downloaded", fileDir);

  return await vscode.commands.executeCommand(
    "vscode.open",
    vscode.Uri.file(fileDir)
  );
}

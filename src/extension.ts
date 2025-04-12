import * as vscode from "vscode";
import LoginAuth from "./app/services/LoginAuth.js";
import ETLApiInstance from "./app/services/ETLApiInstance.js";
import { CourseProvider } from "./app/ui/contentViewer.js";
import DataSyncManager from "./commands/dbsync.js";
import MyDatabase from "./app/services/db.js";
import path from "path";

export function activate(context: vscode.ExtensionContext) {
  const loginAuth = new LoginAuth();
  loginAuth.generatePrivateKey();
  loginAuth.generatePublicKey();

  const loginCommand = vscode.commands.registerCommand(
    "etl.login",
    async () => {
      const result: any = await loginAuth.action();

      const etlApiInstance = ETLApiInstance.getInstance();
      await etlApiInstance.initialize();
      await etlApiInstance.login(result.id, result.pw);

      vscode.window.showInformationMessage("Login success");

      const db = MyDatabase.getInstance();

      const dbsync = DataSyncManager.getInstance(etlApiInstance, db);
      dbsync.syncCourses();

      const provider = new CourseProvider(db.getCourses());
      vscode.window.registerTreeDataProvider("etl-viewer", provider);
    }
  );

  const loginImmediately = vscode.commands.registerCommand(
    "etl.loginImmediately",
    async () => {
      const envPath = path.join(context.extensionPath, ".env");
      require("dotenv").config({ path: envPath });

      const etlApiInstance = ETLApiInstance.getInstance();
      console.log(process.env);

      const id = process.env.ID;
      const pw = process.env.PW;

      if (id && pw) {
        await etlApiInstance.initialize();
        await etlApiInstance.login(id, pw);

        vscode.window.showInformationMessage("Login success");

        const db = MyDatabase.getInstance();

        const dbsync = DataSyncManager.getInstance(etlApiInstance, db);
        dbsync.syncCourses();

        const provider = new CourseProvider(db.getCourses());
        vscode.window.registerTreeDataProvider("etl-viewer", provider);
      } else {
        vscode.window.showErrorMessage("ID or Password not found in .env file");
      }
    }
  );

  const helloWorld = vscode.commands.registerCommand("etl.helloWorld", () => {
    vscode.window.showInformationMessage("Hello World from ETL!");
  });

  context.subscriptions.push(loginCommand);
  context.subscriptions.push(helloWorld);
  context.subscriptions.push(loginImmediately);
}

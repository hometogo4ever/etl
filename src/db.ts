import * as vscode from "vscode";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import * as path from "path";

export let db: JsonDB;

export function initDb() {
    db = new JsonDB(
        new Config(
            path.join(__dirname, "db", "db.json"),
            true,
            true,
            "/",
            false
        )
    );
}


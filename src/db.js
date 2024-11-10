"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initDb = initDb;
var node_json_db_1 = require("node-json-db");
var JsonDBConfig_1 = require("node-json-db/dist/lib/JsonDBConfig");
var path = require("path");
function initDb() {
    exports.db = new node_json_db_1.JsonDB(new JsonDBConfig_1.Config(path.join(__dirname, "db", "db.json"), true, true, "/", false));
}

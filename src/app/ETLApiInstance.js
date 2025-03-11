"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var axios_cookiejar_support_1 = require("axios-cookiejar-support");
var tough_cookie_1 = require("tough-cookie");
var ETLApiInstance = /** @class */ (function () {
    function ETLApiInstance() {
        var _this = this;
        this.jar = new tough_cookie_1.CookieJar();
        this.csrf_token = "";
        this.axiosInstance = (0, axios_cookiejar_support_1.wrapper)(axios_1.default.create({
            baseURL: "https://myetl.snu.ac.kr",
            withCredentials: true,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
            },
            jar: this.jar,
        }));
        this.axiosInstance.interceptors.response.use(function (response) {
            var setCookieHeader = response.headers["set-cookie"];
            if (setCookieHeader) {
                setCookieHeader.forEach(function (cookie) {
                    var parsedCookie = tough_cookie_1.Cookie.parse(cookie);
                    if (parsedCookie && parsedCookie.key === "_csrf_token") {
                        _this.csrf_token = parsedCookie.value;
                    }
                });
            }
            return response;
        });
    }
    ETLApiInstance.prototype.getToken = function () {
        return this.csrf_token;
    };
    ETLApiInstance.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axiosInstance.get("/login/canvas")];
                    case 1:
                        _a.sent();
                        if (this.csrf_token) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ETLApiInstance.prototype.login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.csrf_token) {
                            throw new Error("CSUF token is not initialized");
                        }
                        return [4 /*yield*/, this.axiosInstance.post("/login/canvas", "utf8=✓&redirect_to_ssl=1&" +
                                "authenticity_token=" +
                                this.csrf_token +
                                "&pseudonym_session[unique_id]=" +
                                username +
                                "&pseudonym_session[password]=" +
                                password +
                                "&pseudonym_session[remember_me]=0")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ETLApiInstance.prototype.getCourses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.csrf_token) {
                            throw new Error("CSUF token is not initialized");
                        }
                        return [4 /*yield*/, this.axiosInstance.get("/api/v1/dashboard/dashboard_cards")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    ETLApiInstance.prototype.getAlarms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.csrf_token) {
                            throw new Error("CSUF token is not initialized");
                        }
                        return [4 /*yield*/, this.axiosInstance.get("/api/v1/planner/items")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    ETLApiInstance.prototype.getNotifications = function (course_id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.csrf_token) {
                            throw new Error("CSUF token is not initialized");
                        }
                        return [4 /*yield*/, this.axiosInstance.get("/api/v1/announcements?per_page=10&context_codes[]=course_".concat(course_id, "\n        &page=1\n        &active_only=true\n        &include[]=sections\n        &include[]=sections_user_count"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    ETLApiInstance.prototype.test = function () {
        return __awaiter(this, void 0, void 0, function () {
            var courses, e_1, alarms, e_2, courses, _i, courses_1, course, notifications, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getCourses()];
                    case 1:
                        courses = _a.sent();
                        console.log("TEST 1 : SUCCESS");
                        console.log(courses.map(function (course) { return course.originalName; }));
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.log("TEST 1 : FAILED");
                        return [2 /*return*/];
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.getAlarms()];
                    case 4:
                        alarms = _a.sent();
                        console.log("TEST 2 : SUCCESS");
                        console.log(alarms.map(function (alarm) { return alarm.context_name; }));
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        console.log("TEST 2 : FAILED (", e_2, ")");
                        return [2 /*return*/];
                    case 6:
                        _a.trys.push([6, 12, , 13]);
                        return [4 /*yield*/, this.getCourses()];
                    case 7:
                        courses = _a.sent();
                        _i = 0, courses_1 = courses;
                        _a.label = 8;
                    case 8:
                        if (!(_i < courses_1.length)) return [3 /*break*/, 11];
                        course = courses_1[_i];
                        return [4 /*yield*/, this.getNotifications(course.id)];
                    case 9:
                        notifications = _a.sent();
                        console.log(notifications.map(function (notification) { return notification.title; }));
                        _a.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 8];
                    case 11:
                        console.log("TEST 3 : SUCCESS");
                        return [3 /*break*/, 13];
                    case 12:
                        e_3 = _a.sent();
                        console.log("TEST 3 : FAILED (", e_3, ")");
                        return [2 /*return*/];
                    case 13:
                        console.log("ALL TESTS PASSED");
                        return [2 /*return*/];
                }
            });
        });
    };
    ETLApiInstance.getInstance = function () {
        if (!ETLApiInstance.instance) {
            ETLApiInstance.instance = new ETLApiInstance();
        }
        return ETLApiInstance.instance;
    };
    return ETLApiInstance;
}());
var instance = ETLApiInstance.getInstance();
instance.initialize().then(function () {
    instance
        .login("2023-15725", "MlVPM6B6fJtjL0WSdtNs3JEgRU5uH6Xj")
        .then(function (response) {
        instance.test();
    });
});

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
exports.Login = void 0;
var _a = require('selenium-webdriver'), Builder = _a.Builder, By = _a.By, Key = _a.Key, until = _a.until;
var chrome = require('selenium-webdriver/chrome');
var chromepath = require('chromedriver').path;
var db_1 = require("./db");
var Login = /** @class */ (function () {
    function Login() {
    }
    Login.prototype.authorize = function (stdid) {
        return __awaiter(this, void 0, void 0, function () {
            var options, service, element, idform;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Authorizing...");
                        options = new chrome.Options();
                        service = new chrome.ServiceBuilder(chromepath).build();
                        this.driver = chrome.Driver.createSession(options, service);
                        return [4 /*yield*/, this.driver.get("https://nsso.snu.ac.kr/sso/usr/snu/mfa/login/view")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.driver.wait(until.elementIsVisible(this.driver.findElement(By.id('tab-2'))), 10000)];
                    case 2:
                        element = _a.sent();
                        return [4 /*yield*/, element.click()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.driver.wait(until.elementIsVisible(this.driver.findElement(By.id('fido2_login_id'))), 10000)];
                    case 4:
                        idform = _a.sent();
                        return [4 /*yield*/, idform.sendKeys(stdid)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.driver.findElement(By.id('btnIDTokenCreateFido2')).click()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.driver.sleep(10000)];
                    case 7:
                        _a.sent(); // TODO : this is a temporary solution. Need to find a way to wait for the user to input the OTP.
                        console.log("Authorized!");
                        return [2 /*return*/];
                }
            });
        });
    };
    Login.prototype.getDashboard = function () {
        return __awaiter(this, void 0, void 0, function () {
            var course, courseList, _i, course_1, content, coursename, semester, link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Getting dashboard...");
                        return [4 /*yield*/, this.driver.navigate().to("https://myetl.snu.ac.kr/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.driver.wait(until.elementsLocated(By.className('ic-DashboardCard')), 10000)];
                    case 2:
                        course = _a.sent();
                        courseList = [];
                        _i = 0, course_1 = course;
                        _a.label = 3;
                    case 3:
                        if (!(_i < course_1.length)) return [3 /*break*/, 8];
                        content = course_1[_i];
                        return [4 /*yield*/, content.getAttribute('aria-label')];
                    case 4:
                        coursename = _a.sent();
                        return [4 /*yield*/, content.findElement(By.className('ic-DashboardCard__header-term')).getText()];
                    case 5:
                        semester = _a.sent();
                        return [4 /*yield*/, content.findElement(By.className('ic-DashboardCard__link')).getAttribute('href')];
                    case 6:
                        link = _a.sent();
                        courseList.push(coursename);
                        db_1.db.push("/course/".concat(coursename), {
                            "semester": semester,
                            "link": link
                        });
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 3];
                    case 8:
                        ;
                        db_1.db.push("/courselist", courseList);
                        console.log("Got dashboard!");
                        return [2 /*return*/, course];
                }
            });
        });
    };
    Login.prototype.getAnnouncement = function (course) {
        return __awaiter(this, void 0, void 0, function () {
            var coursenum, element, announcement, i, title, date, link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Getting announcement...");
                        return [4 /*yield*/, db_1.db.getData("/course/".concat(course, "/link"))];
                    case 1:
                        coursenum = _a.sent();
                        console.log(coursenum);
                        return [4 /*yield*/, this.driver.navigate().to(coursenum + "/announcements")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.driver.wait(until.elementsLocated(By.className('ic-item-row ic-announcement-row')), 10000)];
                    case 3:
                        element = _a.sent();
                        announcement = [];
                        console.log("print 1");
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < element.length)) return [3 /*break*/, 9];
                        return [4 /*yield*/, element[i].findElement(By.css('.ic-item-row__content-link-container h3')).getText()];
                    case 5:
                        title = _a.sent();
                        return [4 /*yield*/, element[i].findElement(By.css('.ic-item-row__meta-content-timestamp p')).getText()];
                    case 6:
                        date = _a.sent();
                        return [4 /*yield*/, element[i].findElement(By.className('ic-item-row__content-link')).getAttribute('href')];
                    case 7:
                        link = _a.sent();
                        announcement.push({
                            "title": title,
                            "date": date,
                            "link": link
                        });
                        _a.label = 8;
                    case 8:
                        i++;
                        return [3 /*break*/, 4];
                    case 9:
                        ;
                        db_1.db.push("/course/".concat(course, "/announcement"), announcement);
                        return [2 /*return*/];
                }
            });
        });
    };
    Login.prototype.getModule = function (course) {
        return __awaiter(this, void 0, void 0, function () {
            var coursenum, element, module, i, modulename, contentElements, content, link;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Getting module...");
                        return [4 /*yield*/, db_1.db.getData("/course/".concat(course, "/link"))];
                    case 1:
                        coursenum = _a.sent();
                        return [4 /*yield*/, this.driver.navigate().to(coursenum + "/modules")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.driver.wait(until.elementsLocated(By.css('.context_modules > div')), 10000)];
                    case 3:
                        element = _a.sent();
                        module = [];
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < element.length)) return [3 /*break*/, 10];
                        return [4 /*yield*/, element[i].findElements(By.css('.ig-header header > h2')).getText()];
                    case 5:
                        modulename = _a.sent();
                        return [4 /*yield*/, element[i].findElements(By.className('ig-title'))];
                    case 6:
                        contentElements = _a.sent();
                        return [4 /*yield*/, contentElements.map(function (el) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, el.getText()];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })];
                    case 7:
                        content = _a.sent();
                        return [4 /*yield*/, contentElements.map(function (el) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, el.getAttribute('href')];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })];
                    case 8:
                        link = _a.sent();
                        module.push({
                            "modulename": modulename,
                            "content": content,
                            "link": link
                        });
                        _a.label = 9;
                    case 9:
                        i++;
                        return [3 /*break*/, 4];
                    case 10:
                        ;
                        db_1.db.push("/course/".concat(course, "/module"), module);
                        return [2 /*return*/];
                }
            });
        });
    };
    Login.prototype.getAssignment = function (course) {
        return __awaiter(this, void 0, void 0, function () {
            var coursenum, element, assignment, i, dataid, title, percentage, eachAssignment, contents, _i, contents_1, j, info, link, contentName, detail, isClosed, dueDate, score, myscore;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Getting assignment...");
                        return [4 /*yield*/, db_1.db.getData("/course/".concat(course, "/link"))];
                    case 1:
                        coursenum = _a.sent();
                        return [4 /*yield*/, this.driver.navigate().to(coursenum + "/assignments")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.driver.wait(until.elementsLocated(By.className('item-group-condensed')), 10000)];
                    case 3:
                        element = _a.sent();
                        assignment = [];
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < element.length)) return [3 /*break*/, 20];
                        return [4 /*yield*/, element[i].findElement(By.tagName('div')).getAttribute('data-id')];
                    case 5:
                        dataid = _a.sent();
                        return [4 /*yield*/, element[i].findElement(By.className('element_toggler accessible-toggler')).getText()];
                    case 6:
                        title = _a.sent();
                        return [4 /*yield*/, element[i].findElement(By.css('.pill li')).getText()];
                    case 7:
                        percentage = _a.sent();
                        eachAssignment = [];
                        contents = element[i].findElements(By.className('assignment'));
                        _i = 0, contents_1 = contents;
                        _a.label = 8;
                    case 8:
                        if (!(_i < contents_1.length)) return [3 /*break*/, 18];
                        j = contents_1[_i];
                        return [4 /*yield*/, j.findElement(By.css('.ig-info a'))];
                    case 9:
                        info = _a.sent();
                        return [4 /*yield*/, info.getAttribute('href')];
                    case 10:
                        link = _a.sent();
                        return [4 /*yield*/, info.getText()];
                    case 11:
                        contentName = _a.sent();
                        return [4 /*yield*/, j.findElement(By.className('ig-detail'))];
                    case 12:
                        detail = _a.sent();
                        return [4 /*yield*/, detail.findElement(By.className('status-description')).getText()];
                    case 13:
                        isClosed = _a.sent();
                        return [4 /*yield*/, j.findElement(By.css('.assignment-date-due .screenreader-only')).getText()];
                    case 14:
                        dueDate = _a.sent();
                        return [4 /*yield*/, j.findElement(By.css('.js-score .score-display')).getText()];
                    case 15:
                        score = _a.sent();
                        return [4 /*yield*/, j.findElement(By.css('.js-score .score-display b')).getText()];
                    case 16:
                        myscore = _a.sent();
                        eachAssignment.push({
                            "link": link,
                            "contentName": contentName,
                            "isClosed": isClosed,
                            "dueDate": dueDate,
                            "score": score,
                            "myscore": myscore
                        });
                        _a.label = 17;
                    case 17:
                        _i++;
                        return [3 /*break*/, 8];
                    case 18:
                        assignment.push({
                            "title": title,
                            "percentage": percentage,
                            "assignment": eachAssignment
                        });
                        _a.label = 19;
                    case 19:
                        i++;
                        return [3 /*break*/, 4];
                    case 20:
                        ;
                        db_1.db.push("/course/".concat(course, "/assignment"), assignment);
                        return [2 /*return*/];
                }
            });
        });
    };
    Login.prototype.getFiles = function (course) {
        return __awaiter(this, void 0, void 0, function () {
            var coursenum, element, assignment, i, title, link, createdDate, modifiedDate, size;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Getting files...");
                        return [4 /*yield*/, db_1.db.getData("/course/".concat(course, "/link"))];
                    case 1:
                        coursenum = _a.sent();
                        return [4 /*yield*/, this.driver.navigate().to(coursenum + "/afiles")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.driver.wait(until.elementsLocated(By.className('ef-item-row')), 10000)];
                    case 3:
                        element = _a.sent();
                        assignment = [];
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < element.length)) return [3 /*break*/, 11];
                        return [4 /*yield*/, element[i].findElement(By.className('ef-name-col__text')).getText()];
                    case 5:
                        title = _a.sent();
                        return [4 /*yield*/, element[i].findElement(By.className('ef-name-col__link')).getAttribute('href')];
                    case 6:
                        link = _a.sent();
                        return [4 /*yield*/, element[i].findElement(By.css('.ef-date-created-col span span')).getText()];
                    case 7:
                        createdDate = _a.sent();
                        return [4 /*yield*/, element[i].findElement(By.css('.ef-date-modified-col span span')).getText()];
                    case 8:
                        modifiedDate = _a.sent();
                        return [4 /*yield*/, element[i].findElement(By.className('ef-size-col')).getText()];
                    case 9:
                        size = _a.sent();
                        assignment.push({
                            "title": title,
                            "link": link,
                            "createdDate": createdDate,
                            "modifiedDate": modifiedDate,
                            "size": size
                        });
                        _a.label = 10;
                    case 10:
                        i++;
                        return [3 /*break*/, 4];
                    case 11:
                        ;
                        db_1.db.push("/course/".concat(course, "/assignment"), assignment);
                        return [2 /*return*/];
                }
            });
        });
    };
    Login.prototype.main = function () {
        return __awaiter(this, void 0, void 0, function () {
            var courses, _i, courses_1, course;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, db_1.initDb)();
                        return [4 /*yield*/, this.authorize("hometogo0625")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, db_1.db.getData("/courselist")];
                    case 2:
                        courses = _a.sent();
                        _i = 0, courses_1 = courses;
                        _a.label = 3;
                    case 3:
                        if (!(_i < courses_1.length)) return [3 /*break*/, 9];
                        course = courses_1[_i];
                        return [4 /*yield*/, this.getAnnouncement(course)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.getModule(course)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.getAssignment(course)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.getFiles(course)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 3];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return Login;
}());
exports.Login = Login;
var login = new Login();
login.main();

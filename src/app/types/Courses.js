"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
var Course = /** @class */ (function () {
    function Course(originalName, courseCode, assetString, href, term, id, isFavorite) {
        this.originalName = originalName;
        this.courseCode = courseCode;
        this.assetString = assetString;
        this.href = href;
        this.term = term;
        this.id = id;
        this.isFavorite = isFavorite;
    }
    return Course;
}());
exports.Course = Course;

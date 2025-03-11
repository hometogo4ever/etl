"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.PlannableNotification = exports.Plannable = void 0;
var Plannable = /** @class */ (function () {
    function Plannable(id, title, unread_count, read_state, created_at, updated_at) {
        this.id = id;
        this.title = title;
        this.unread_count = unread_count;
        this.read_state = read_state;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
    return Plannable;
}());
exports.Plannable = Plannable;
var PlannableNotification = /** @class */ (function () {
    function PlannableNotification(context_type, course_id, plannable_id, plannable_type, plannable_date, plannable, html_url, context_name) {
        this.context_type = context_type;
        this.course_id = course_id;
        this.plannable_id = plannable_id;
        this.plannable_type = plannable_type;
        this.plannable_date = plannable_date;
        this.plannable = plannable;
        this.html_url = html_url;
        this.context_name = context_name;
    }
    return PlannableNotification;
}());
exports.PlannableNotification = PlannableNotification;
var Notification = /** @class */ (function () {
    function Notification(id, title, last_reply_at, created_at, delayed_post_at, posted_at, assignment_id, root_topic_id, position, user_name, url, lock_explanation, read_state) {
        this.id = id;
        this.title = title;
        this.last_reply_at = last_reply_at;
        this.created_at = created_at;
        this.delayed_post_at = delayed_post_at;
        this.posted_at = posted_at;
        this.assignment_id = assignment_id;
        this.root_topic_id = root_topic_id;
        this.position = position;
        this.user_name = user_name;
        this.url = url;
        this.lock_explanation = lock_explanation;
        this.read_state = read_state;
    }
    return Notification;
}());
exports.Notification = Notification;

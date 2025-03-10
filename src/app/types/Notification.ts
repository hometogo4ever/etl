export class Plannable {
  id: string;
  title: string;
  unread_count: number;
  read_state: string;
  created_at: string;
  updated_at: string;

  constructor(
    id: string,
    title: string,
    unread_count: number,
    read_state: string,
    created_at: string,
    updated_at: string
  ) {
    this.id = id;
    this.title = title;
    this.unread_count = unread_count;
    this.read_state = read_state;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export class PlannableNotification {
  context_type: string;
  course_id: string;
  plannable_id: string;
  plannable_type: string;
  plannable_date: string;
  plannable: Plannable;
  html_url: string;
  context_name: string;

  constructor(
    context_type: string,
    course_id: string,
    plannable_id: string,
    plannable_type: string,
    plannable_date: string,
    plannable: Plannable,
    html_url: string,
    context_name: string
  ) {
    this.context_type = context_type;
    this.course_id = course_id;
    this.plannable_id = plannable_id;
    this.plannable_type = plannable_type;
    this.plannable_date = plannable_date;
    this.plannable = plannable;
    this.html_url = html_url;
    this.context_name = context_name;
  }
}

export class Notification {
  id: string;
  title: string;
  last_reply_at: string;
  created_at: string;
  delayed_post_at: string;
  posted_at: string;
  assignment_id: string;
  root_topic_id: string;
  position: number;
  user_name: string;
  url: string;
  lock_explanation: string;
  read_state: string;

  constructor(
    id: string,
    title: string,
    last_reply_at: string,
    created_at: string,
    delayed_post_at: string,
    posted_at: string,
    assignment_id: string,
    root_topic_id: string,
    position: number,
    user_name: string,
    url: string,
    lock_explanation: string,
    read_state: string
  ) {
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
}

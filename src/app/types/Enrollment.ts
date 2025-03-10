import { Grade } from "./Grade";

export class Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  type: string;
  created_at: string;
  updated_at: string;
  associated_user_id: string;
  start_at: string;
  end_at: string;
  course_section_id: string;
  root_account_id: string;
  limit_privileges_to_course_section: boolean;
  enrollment_state: string;
  role: string;
  role_id: string;
  last_activity_at: string;
  last_attended_at: string;
  total_activity_time: number;
  grades: Grade;
  html_url: string;
  can_be_removed: boolean;

  constructor(
    id: string,
    user_id: string,
    course_id: string,
    type: string,
    created_at: string,
    updated_at: string,
    associated_user_id: string,
    start_at: string,
    end_at: string,
    course_section_id: string,
    root_account_id: string,
    limit_privileges_to_course_section: boolean,
    enrollment_state: string,
    role: string,
    role_id: string,
    last_activity_at: string,
    last_attended_at: string,
    total_activity_time: number,
    grades: Grade,
    html_url: string,
    can_be_removed: boolean
  ) {
    this.id = id;
    this.user_id = user_id;
    this.course_id = course_id;
    this.type = type;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.associated_user_id = associated_user_id;
    this.start_at = start_at;
    this.end_at = end_at;
    this.course_section_id = course_section_id;
    this.root_account_id = root_account_id;
    this.limit_privileges_to_course_section =
      limit_privileges_to_course_section;
    this.enrollment_state = enrollment_state;
    this.role = role;
    this.role_id = role_id;
    this.last_activity_at = last_activity_at;
    this.last_attended_at = last_attended_at;
    this.total_activity_time = total_activity_time;
    this.grades = grades;
    this.html_url = html_url;
    this.can_be_removed = can_be_removed;
  }
}

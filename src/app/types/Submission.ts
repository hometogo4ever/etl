import { Attachment } from "./Attachment.js";

export class Submission {
  id: string;
  grade: string;
  score: number;
  submitted_at: string;
  assignment_id: string;
  user_id: string;
  submission_type: string;
  workflow_state: string;
  grade_matches_current_submission: boolean;
  graded_at: string;
  grader_id: string;
  attempt: number;
  cached_due_date: string;
  excused: boolean;
  late_policy_status: string;
  points_deducted: number;
  grading_period_id: string;
  extra_attempts: string;
  posted_at: string;
  late: boolean;
  missing: boolean;
  seconds_late: number;
  entered_grade: string;
  entered_score: number;
  preview_url: string;
  attachments: Attachment[];

  constructor(
    id: string,
    grade: string,
    score: number,
    submitted_at: string,
    assignment_id: string,
    user_id: string,
    submission_type: string,
    workflow_state: string,
    grade_matches_current_submission: boolean,
    graded_at: string,
    grader_id: string,
    attempt: number,
    cached_due_date: string,
    excused: boolean,
    late_policy_status: string,
    points_deducted: number,
    grading_period_id: string,
    extra_attempts: string,
    posted_at: string,
    late: boolean,
    missing: boolean,
    seconds_late: number,
    entered_grade: string,
    entered_score: number,
    preview_url: string,
    attachments: Attachment[]
  ) {
    this.id = id;
    this.grade = grade;
    this.score = score;
    this.submitted_at = submitted_at;
    this.assignment_id = assignment_id;
    this.user_id = user_id;
    this.submission_type = submission_type;
    this.workflow_state = workflow_state;
    this.grade_matches_current_submission = grade_matches_current_submission;
    this.graded_at = graded_at;
    this.grader_id = grader_id;
    this.attempt = attempt;
    this.cached_due_date = cached_due_date;
    this.excused = excused;
    this.late_policy_status = late_policy_status;
    this.points_deducted = points_deducted;
    this.grading_period_id = grading_period_id;
    this.extra_attempts = extra_attempts;
    this.posted_at = posted_at;
    this.late = late;
    this.missing = missing;
    this.seconds_late = seconds_late;
    this.entered_grade = entered_grade;
    this.entered_score = entered_score;
    this.preview_url = preview_url;
    this.attachments = attachments;
  }
}

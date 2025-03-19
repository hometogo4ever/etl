// database.ts
import Database = require("better-sqlite3");
import { User, UserFull } from "./types/User";
import { Course } from "./types/Courses";
import { Grade } from "./types/Grade";
import { Enrollment } from "./types/Enrollment";
import { Attachment, Folder } from "./types/Attachment";
import {
  Notification,
  Plannable,
  PlannableNotification,
} from "./types/Notification";
import { Submission } from "./types/Submission";

/**
 * SQLite DB 접근 및 각 엔티티를 INSERT하는 메서드를 제공하는 클래스
 */
class MyDatabase {
  private db: any; // better-sqlite3의 DB 인스턴스

  constructor(fileName: string = "example.db") {
    // DB 파일 오픈
    this.db = new Database(fileName);
    // 외래 키 설정 + 테이블 초기화
    this.initializeDatabase();
  }

  /**
   * DB 스키마(테이블) 초기화
   */
  private initializeDatabase(): void {
    // 외래 키 활성화
    this.db.exec(`PRAGMA foreign_keys = ON;`);

    // 테이블 생성
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS Users (
        user_pk           INTEGER PRIMARY KEY AUTOINCREMENT,
        id                INTEGER,
        display_name      TEXT,
        avatar_image_url  TEXT,
        html_url          TEXT
      );

      CREATE TABLE IF NOT EXISTS Courses (
        course_pk     INTEGER PRIMARY KEY AUTOINCREMENT,
        originalName  TEXT,
        courseCode    TEXT,
        assetString   TEXT,
        href          TEXT,
        term          TEXT,
        id            TEXT,
        isFavorite    INTEGER
      );

      CREATE TABLE IF NOT EXISTS Grades (
        grade_pk       INTEGER PRIMARY KEY AUTOINCREMENT,
        html_url       TEXT,
        current_score  REAL,
        current_grade  TEXT,
        final_score    REAL,
        final_grade    TEXT
      );

      CREATE TABLE IF NOT EXISTS Enrollments (
        enrollment_pk    INTEGER PRIMARY KEY AUTOINCREMENT,
        id               TEXT,
        user_id          TEXT,
        course_id        TEXT,
        type             TEXT,
        created_at       TEXT,
        updated_at       TEXT,
        associated_user_id  TEXT,
        start_at         TEXT,
        end_at           TEXT,
        course_section_id    TEXT,
        root_account_id      TEXT,
        limit_privileges_to_course_section INTEGER,
        enrollment_state     TEXT,
        role                 TEXT,
        role_id              TEXT,
        last_activity_at     TEXT,
        last_attended_at     TEXT,
        total_activity_time  INTEGER,
        grades_fk       INTEGER,
        html_url        TEXT,
        can_be_removed  INTEGER,

        FOREIGN KEY (grades_fk) REFERENCES Grades(grade_pk)
      );

      CREATE TABLE IF NOT EXISTS Folders (
        folder_pk        INTEGER PRIMARY KEY AUTOINCREMENT,
        id               TEXT,
        name             TEXT,
        full_name        TEXT,
        context_id       TEXT,
        context_type     TEXT,
        parent_folder_id TEXT,
        created_at       TEXT,
        updated_at       TEXT,
        lock_at          TEXT,
        unlock_at        TEXT,
        position         INTEGER,
        locked           INTEGER,
        folders_url      TEXT,
        files_url        TEXT,
        files_count      INTEGER,
        folders_count    INTEGER,
        hidden           INTEGER,
        locked_for_user  INTEGER,
        hidden_for_user  INTEGER,
        for_submissions  INTEGER,
        can_upload       INTEGER
      );

      CREATE TABLE IF NOT EXISTS UsersFull (
        user_full_pk   INTEGER PRIMARY KEY AUTOINCREMENT,
        id             INTEGER,
        name           TEXT,
        created_at     TEXT,
        sortable_name  TEXT,
        avatar_url     TEXT,
        enrollments_json  TEXT,
        custom_links_json TEXT
      );

      CREATE TABLE IF NOT EXISTS Plannables (
        plannable_pk   INTEGER PRIMARY KEY AUTOINCREMENT,
        id             TEXT,
        title          TEXT,
        unread_count   INTEGER,
        read_state     TEXT,
        created_at     TEXT,
        updated_at     TEXT
      );

      CREATE TABLE IF NOT EXISTS PlannableNotifications (
        plannable_notification_pk INTEGER PRIMARY KEY AUTOINCREMENT,
        context_type     TEXT,
        course_id        TEXT,
        plannable_id     TEXT,
        plannable_type   TEXT,
        plannable_date   TEXT,
        html_url         TEXT,
        context_name     TEXT,
        plannable_fk     INTEGER,

        FOREIGN KEY (plannable_fk) REFERENCES Plannables(plannable_pk)
      );

      CREATE TABLE IF NOT EXISTS Notifications (
        notification_pk   INTEGER PRIMARY KEY AUTOINCREMENT,
        id                TEXT,
        title             TEXT,
        last_reply_at     TEXT,
        created_at        TEXT,
        delayed_post_at   TEXT,
        posted_at         TEXT,
        assignment_id     TEXT,
        root_topic_id     TEXT,
        position          INTEGER,
        user_name         TEXT,
        url               TEXT,
        lock_explanation  TEXT,
        read_state        TEXT
      );

      CREATE TABLE IF NOT EXISTS Submissions (
        submission_pk   INTEGER PRIMARY KEY AUTOINCREMENT,
        id                             TEXT,
        grade                          TEXT,
        score                          REAL,
        submitted_at                   TEXT,
        assignment_id                  TEXT,
        user_id                        TEXT,
        submission_type                TEXT,
        workflow_state                 TEXT,
        grade_matches_current_submission INTEGER,
        graded_at                      TEXT,
        grader_id                      TEXT,
        attempt                        INTEGER,
        cached_due_date                TEXT,
        excused                        INTEGER,
        late_policy_status             TEXT,
        points_deducted                REAL,
        grading_period_id              TEXT,
        extra_attempts                 TEXT,
        posted_at                      TEXT,
        late                           INTEGER,
        missing                        INTEGER,
        seconds_late                   INTEGER,
        entered_grade                  TEXT,
        entered_score                  REAL,
        preview_url                    TEXT
      );

      CREATE TABLE IF NOT EXISTS Attachments (
        attachment_pk   INTEGER PRIMARY KEY AUTOINCREMENT,
        id              TEXT,
        uuid            TEXT,
        folder_id       TEXT,
        display_name    TEXT,
        filename        TEXT,
        upload_status   TEXT,
        content_type    TEXT,
        url             TEXT,
        size            INTEGER,
        created_at      TEXT,
        updated_at      TEXT,
        unlock_at       TEXT,
        locked          INTEGER,
        hidden          INTEGER,
        lock_at         TEXT,
        hidden_for_user INTEGER,
        thumbnail_url   TEXT,
        mime_class      TEXT,
        modified_at     TEXT,
        locked_for_user INTEGER,

        user_fk         INTEGER,
        submission_fk   INTEGER,

        FOREIGN KEY (user_fk) REFERENCES Users(user_pk),
        FOREIGN KEY (submission_fk) REFERENCES Submissions(submission_pk)
      );
    `);
  }

  /**
   * Boolean -> 0/1 변환
   */
  private boolToInt(value: boolean): number {
    return value ? 1 : 0;
  }

  /**
   * 객체 또는 배열 -> JSON 문자열 변환
   */
  private toJson(value: any): string {
    return JSON.stringify(value ?? null);
  }

  /** User INSERT */
  public insertUser(user: User): number {
    const stmt = this.db.prepare(`
      INSERT INTO Users (id, display_name, avatar_image_url, html_url)
      VALUES (@id, @display_name, @avatar_image_url, @html_url)
    `);
    const result = stmt.run({
      id: user.id,
      display_name: user.display_name,
      avatar_image_url: user.avatar_image_url,
      html_url: user.html_url,
    });
    return Number(result.lastInsertRowid);
  }

  /** Course INSERT */
  public insertCourse(course: Course): number {
    const stmt = this.db.prepare(`
      INSERT INTO Courses (
        originalName, courseCode, assetString, href, term, id, isFavorite
      ) VALUES (
        @originalName, @courseCode, @assetString, @href, @term, @id, @isFavorite
      )
    `);
    const result = stmt.run({
      originalName: course.originalName,
      courseCode: course.courseCode,
      assetString: course.assetString,
      href: course.href,
      term: course.term,
      id: course.id,
      isFavorite: this.boolToInt(course.isFavorite),
    });
    return Number(result.lastInsertRowid);
  }

  /** Grade INSERT */
  public insertGrade(grade: Grade): number {
    const stmt = this.db.prepare(`
      INSERT INTO Grades (
        html_url,
        current_score,
        current_grade,
        final_score,
        final_grade
      ) VALUES (
        @html_url,
        @current_score,
        @current_grade,
        @final_score,
        @final_grade
      )
    `);
    const result = stmt.run({
      html_url: grade.html_url,
      current_score: grade.current_score,
      current_grade: grade.current_grade,
      final_score: grade.final_score,
      final_grade: grade.final_grade,
    });
    return Number(result.lastInsertRowid);
  }

  /** Enrollment INSERT */
  public insertEnrollment(enrollment: Enrollment, gradePk?: number): number {
    const stmt = this.db.prepare(`
      INSERT INTO Enrollments (
        id,
        user_id,
        course_id,
        type,
        created_at,
        updated_at,
        associated_user_id,
        start_at,
        end_at,
        course_section_id,
        root_account_id,
        limit_privileges_to_course_section,
        enrollment_state,
        role,
        role_id,
        last_activity_at,
        last_attended_at,
        total_activity_time,
        grades_fk,
        html_url,
        can_be_removed
      ) VALUES (
        @id,
        @user_id,
        @course_id,
        @type,
        @created_at,
        @updated_at,
        @associated_user_id,
        @start_at,
        @end_at,
        @course_section_id,
        @root_account_id,
        @limit_privileges_to_course_section,
        @enrollment_state,
        @role,
        @role_id,
        @last_activity_at,
        @last_attended_at,
        @total_activity_time,
        @grades_fk,
        @html_url,
        @can_be_removed
      )
    `);
    const result = stmt.run({
      id: enrollment.id,
      user_id: enrollment.user_id,
      course_id: enrollment.course_id,
      type: enrollment.type,
      created_at: enrollment.created_at,
      updated_at: enrollment.updated_at,
      associated_user_id: enrollment.associated_user_id,
      start_at: enrollment.start_at,
      end_at: enrollment.end_at,
      course_section_id: enrollment.course_section_id,
      root_account_id: enrollment.root_account_id,
      limit_privileges_to_course_section: this.boolToInt(
        enrollment.limit_privileges_to_course_section
      ),
      enrollment_state: enrollment.enrollment_state,
      role: enrollment.role,
      role_id: enrollment.role_id,
      last_activity_at: enrollment.last_activity_at,
      last_attended_at: enrollment.last_attended_at,
      total_activity_time: enrollment.total_activity_time,
      grades_fk: gradePk ?? null, // Grades 테이블 FK
      html_url: enrollment.html_url,
      can_be_removed: this.boolToInt(enrollment.can_be_removed),
    });
    return Number(result.lastInsertRowid);
  }

  /** Folder INSERT */
  public insertFolder(folder: Folder): number {
    const stmt = this.db.prepare(`
      INSERT INTO Folders (
        id,
        name,
        full_name,
        context_id,
        context_type,
        parent_folder_id,
        created_at,
        updated_at,
        lock_at,
        unlock_at,
        position,
        locked,
        folders_url,
        files_url,
        files_count,
        folders_count,
        hidden,
        locked_for_user,
        hidden_for_user,
        for_submissions,
        can_upload
      ) VALUES (
        @id,
        @name,
        @full_name,
        @context_id,
        @context_type,
        @parent_folder_id,
        @created_at,
        @updated_at,
        @lock_at,
        @unlock_at,
        @position,
        @locked,
        @folders_url,
        @files_url,
        @files_count,
        @folders_count,
        @hidden,
        @locked_for_user,
        @hidden_for_user,
        @for_submissions,
        @can_upload
      )
    `);
    const result = stmt.run({
      id: folder.id,
      name: folder.name,
      full_name: folder.full_name,
      context_id: folder.context_id,
      context_type: folder.context_type,
      parent_folder_id: folder.parent_folder_id,
      created_at: folder.created_at,
      updated_at: folder.updated_at,
      lock_at: folder.lock_at,
      unlock_at: folder.unlock_at,
      position: folder.position,
      locked: this.boolToInt(folder.locked),
      folders_url: folder.folders_url,
      files_url: folder.files_url,
      files_count: folder.files_count,
      folders_count: folder.folders_count,
      hidden: this.boolToInt(folder.hidden),
      locked_for_user: this.boolToInt(folder.locked_for_user),
      hidden_for_user: this.boolToInt(folder.hidden_for_user),
      for_submissions: this.boolToInt(folder.for_submissions),
      can_upload: this.boolToInt(folder.can_upload),
    });
    return Number(result.lastInsertRowid);
  }

  /** Attachment INSERT */
  public insertAttachment(
    attachment: Attachment,
    userPk?: number,
    submissionPk?: number
  ): number {
    const stmt = this.db.prepare(`
      INSERT INTO Attachments (
        id, uuid, folder_id, display_name, filename,
        upload_status, content_type, url, size,
        created_at, updated_at, unlock_at, locked,
        hidden, lock_at, hidden_for_user, thumbnail_url,
        mime_class, modified_at, locked_for_user,
        user_fk, submission_fk
      ) VALUES (
        @id, @uuid, @folder_id, @display_name, @filename,
        @upload_status, @content_type, @url, @size,
        @created_at, @updated_at, @unlock_at, @locked,
        @hidden, @lock_at, @hidden_for_user, @thumbnail_url,
        @mime_class, @modified_at, @locked_for_user,
        @user_fk, @submission_fk
      )
    `);

    const result = stmt.run({
      id: attachment.id,
      uuid: attachment.uuid,
      folder_id: attachment.folder_id,
      display_name: attachment.display_name,
      filename: attachment.filename,
      upload_status: attachment.upload_status,
      content_type: attachment.content_type,
      url: attachment.url,
      size: attachment.size,
      created_at: attachment.created_at,
      updated_at: attachment.updated_at,
      unlock_at: attachment.unlock_at,
      locked: this.boolToInt(attachment.locked),
      hidden: this.boolToInt(attachment.hidden),
      lock_at: attachment.lock_at,
      hidden_for_user: this.boolToInt(attachment.hidden_for_user),
      thumbnail_url: attachment.thumbnail_url,
      mime_class: attachment.mime_class,
      modified_at: attachment.modified_at,
      locked_for_user: this.boolToInt(attachment.locked_for_user),
      user_fk: userPk ?? null,
      submission_fk: submissionPk ?? null,
    });
    return Number(result.lastInsertRowid);
  }

  /** Plannable INSERT */
  public insertPlannable(plannable: Plannable): number {
    const stmt = this.db.prepare(`
      INSERT INTO Plannables (
        id, title, unread_count, read_state,
        created_at, updated_at
      ) VALUES (
        @id, @title, @unread_count, @read_state,
        @created_at, @updated_at
      )
    `);
    const result = stmt.run({
      id: plannable.id,
      title: plannable.title,
      unread_count: plannable.unread_count,
      read_state: plannable.read_state,
      created_at: plannable.created_at,
      updated_at: plannable.updated_at,
    });
    return Number(result.lastInsertRowid);
  }

  /** PlannableNotification INSERT */
  public insertPlannableNotification(
    pn: PlannableNotification,
    plannablePk?: number
  ): number {
    const stmt = this.db.prepare(`
      INSERT INTO PlannableNotifications (
        context_type, course_id, plannable_id, plannable_type,
        plannable_date, html_url, context_name, plannable_fk
      ) VALUES (
        @context_type, @course_id, @plannable_id, @plannable_type,
        @plannable_date, @html_url, @context_name, @plannable_fk
      )
    `);
    const result = stmt.run({
      context_type: pn.context_type,
      course_id: pn.course_id,
      plannable_id: pn.plannable_id,
      plannable_type: pn.plannable_type,
      plannable_date: pn.plannable_date,
      html_url: pn.html_url,
      context_name: pn.context_name,
      plannable_fk: plannablePk ?? null,
    });
    return Number(result.lastInsertRowid);
  }

  /** Notification INSERT */
  public insertNotification(notification: Notification): number {
    const stmt = this.db.prepare(`
      INSERT INTO Notifications (
        id,
        title,
        last_reply_at,
        created_at,
        delayed_post_at,
        posted_at,
        assignment_id,
        root_topic_id,
        position,
        user_name,
        url,
        lock_explanation,
        read_state
      ) VALUES (
        @id,
        @title,
        @last_reply_at,
        @created_at,
        @delayed_post_at,
        @posted_at,
        @assignment_id,
        @root_topic_id,
        @position,
        @user_name,
        @url,
        @lock_explanation,
        @read_state
      )
    `);
    const result = stmt.run({
      id: notification.id,
      title: notification.title,
      last_reply_at: notification.last_reply_at,
      created_at: notification.created_at,
      delayed_post_at: notification.delayed_post_at,
      posted_at: notification.posted_at,
      assignment_id: notification.assignment_id,
      root_topic_id: notification.root_topic_id,
      position: notification.position,
      user_name: notification.user_name,
      url: notification.url,
      lock_explanation: notification.lock_explanation,
      read_state: notification.read_state,
    });
    return Number(result.lastInsertRowid);
  }

  /** Submission INSERT (Attachment[] 동시 처리) */
  public insertSubmission(submission: Submission): number {
    const stmt = this.db.prepare(`
      INSERT INTO Submissions (
        id,
        grade,
        score,
        submitted_at,
        assignment_id,
        user_id,
        submission_type,
        workflow_state,
        grade_matches_current_submission,
        graded_at,
        grader_id,
        attempt,
        cached_due_date,
        excused,
        late_policy_status,
        points_deducted,
        grading_period_id,
        extra_attempts,
        posted_at,
        late,
        missing,
        seconds_late,
        entered_grade,
        entered_score,
        preview_url
      ) VALUES (
        @id,
        @grade,
        @score,
        @submitted_at,
        @assignment_id,
        @user_id,
        @submission_type,
        @workflow_state,
        @grade_matches_current_submission,
        @graded_at,
        @grader_id,
        @attempt,
        @cached_due_date,
        @excused,
        @late_policy_status,
        @points_deducted,
        @grading_period_id,
        @extra_attempts,
        @posted_at,
        @late,
        @missing,
        @seconds_late,
        @entered_grade,
        @entered_score,
        @preview_url
      )
    `);
    const result = stmt.run({
      id: submission.id,
      grade: submission.grade,
      score: submission.score,
      submitted_at: submission.submitted_at,
      assignment_id: submission.assignment_id,
      user_id: submission.user_id,
      submission_type: submission.submission_type,
      workflow_state: submission.workflow_state,
      grade_matches_current_submission: this.boolToInt(
        submission.grade_matches_current_submission
      ),
      graded_at: submission.graded_at,
      grader_id: submission.grader_id,
      attempt: submission.attempt,
      cached_due_date: submission.cached_due_date,
      excused: this.boolToInt(submission.excused),
      late_policy_status: submission.late_policy_status,
      points_deducted: submission.points_deducted,
      grading_period_id: submission.grading_period_id,
      extra_attempts: submission.extra_attempts,
      posted_at: submission.posted_at,
      late: this.boolToInt(submission.late),
      missing: this.boolToInt(submission.missing),
      seconds_late: submission.seconds_late,
      entered_grade: submission.entered_grade,
      entered_score: submission.entered_score,
      preview_url: submission.preview_url,
    });

    // Attachment[] 처리 (1:N)
    const submissionPk = Number(result.lastInsertRowid);
    if (submission.attachments && submission.attachments.length > 0) {
      for (const att of submission.attachments) {
        this.insertAttachment(att, undefined, submissionPk);
      }
    }

    return submissionPk;
  }

  /** UserFull INSERT (Enrollment[], custom_links -> JSON 직렬화) */
  public insertUserFull(userFull: UserFull): number {
    const stmt = this.db.prepare(`
      INSERT INTO UsersFull (
        id,
        name,
        created_at,
        sortable_name,
        avatar_url,
        enrollments_json,
        custom_links_json
      ) VALUES (
        @id,
        @name,
        @created_at,
        @sortable_name,
        @avatar_url,
        @enrollments_json,
        @custom_links_json
      )
    `);
    const result = stmt.run({
      id: userFull.id,
      name: userFull.name,
      created_at: userFull.created_at,
      sortable_name: userFull.sortable_name,
      avatar_url: userFull.avatar_url,
      enrollments_json: this.toJson(userFull.enrollments),
      custom_links_json: this.toJson(userFull.custom_links),
    });
    return Number(result.lastInsertRowid);
  }

  /**
   * 예시로 간단하게 DB에 Insert를 시도해보는 함수
   */
  public exampleUsage(): void {
    // 1) User 삽입
    const user = new User(101, "Alice", "http://avatar", "http://profile");
    const userPk = this.insertUser(user);
    console.log("Inserted User PK:", userPk);

    // 2) Course 삽입
    const course = new Course(
      "OriginalName",
      "CODE101",
      "assetX",
      "/course/101",
      "Spring",
      "course_101",
      true
    );
    const coursePk = this.insertCourse(course);
    console.log("Inserted Course PK:", coursePk);

    // 3) Grade 삽입
    const grade = new Grade("http://gradeurl", 95, "A", 95, "A");
    const gradePk = this.insertGrade(grade);
    console.log("Inserted Grade PK:", gradePk);

    // 4) Enrollment 삽입 (Grade 연결)
    const enrollment = new Enrollment(
      "enroll_1",
      "101", // user_id
      "course_101", // course_id
      "StudentEnrollment",
      "2023-01-01",
      "2023-02-01",
      "0",
      "2023-01-10",
      "2023-06-01",
      "section_1",
      "root_1",
      false,
      "active",
      "Student",
      "role_1",
      "2023-02-10",
      "2023-03-01",
      1200,
      grade, // Grade 객체
      "http://enrollment_url",
      true
    );
    const enrollmentPk = this.insertEnrollment(enrollment, gradePk);
    console.log("Inserted Enrollment PK:", enrollmentPk);

    // 필요에 따라 다른 엔티티도 Insert...
  }
}

// ----
// 사용 예시 (이 파일 자체의 맨 아래에 넣거나, 외부에서 import하여 사용)
// const myDB = new MyDatabase('mydata.db');
// myDB.exampleUsage();

export default MyDatabase;

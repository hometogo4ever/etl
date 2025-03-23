// database.ts
import sqlite from "sqlite3";
import { User, UserFull } from "../types/User.js";
import { Course } from "../types/Courses.js";
import { Grade } from "../types/Grade.js";
import { Enrollment } from "../types/Enrollment.js";
import { Attachment, Folder } from "../types/Attachment.js";
import {
  Notification,
  Plannable,
  PlannableNotification,
} from "../types/Notification.js";
import { Submission } from "../types/Submission.js";
import { Assignment } from "../types/Assignment.js";
import { ModuleGroup } from "../types/ModuleGroup.js";
import { AssignmentGroup } from "../types/AssignmentGroup.js";
import { StudentModule } from "../types/Module.js";

/**
 * SQLite DB 접근 및 각 엔티티를 INSERT하는 메서드를 제공하는 클래스
 */
class MyDatabase {
  private db: any; // better-sqlite3의 DB 인스턴스

  private static instance: MyDatabase;

  public static getInstance(fileName: string = "example.db"): MyDatabase {
    if (!MyDatabase.instance) {
      MyDatabase.instance = new MyDatabase(fileName);
    }
    return MyDatabase.instance;
  }

  constructor(fileName: string = "example.db") {
    // DB 파일 오픈
    this.db = new sqlite.Database(fileName);
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

    // ---- 새로 추가되는 테이블들 (ModuleGroup, StudentModule, AssignmentGroup, Assignment) ----
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ModuleGroups (
        module_group_pk  INTEGER PRIMARY KEY AUTOINCREMENT,
        completed_at     TEXT,
        id               TEXT,
        item_count       INTEGER,
        item_url         TEXT,
        name             TEXT,
        position         INTEGER,
        prerequisite_module_ids TEXT,  -- JSON array
        publish_final_grade        INTEGER, -- boolean
        require_sequential_progress INTEGER, -- boolean
        state            TEXT,
        unlock_at        TEXT
      );

      CREATE TABLE IF NOT EXISTS StudentModules (
        student_module_pk INTEGER PRIMARY KEY AUTOINCREMENT,
        id          TEXT,
        title       TEXT,
        position    INTEGER,
        intent      INTEGER,
        type        TEXT,
        module_id   TEXT,
        html_url    TEXT,
        content_id  INTEGER,
        url         TEXT,
        external_url TEXT
      );

      CREATE TABLE IF NOT EXISTS AssignmentGroups (
        assignment_group_pk INTEGER PRIMARY KEY AUTOINCREMENT,
        id                TEXT,
        name              TEXT,
        position          INTEGER,
        group_weight      REAL,
        sis_source_id     TEXT,
        integration_data  TEXT,
        rules             TEXT,
        any_assignment_in_closed_grading_period INTEGER
      );

      CREATE TABLE IF NOT EXISTS Assignments (
        assignment_pk INTEGER PRIMARY KEY AUTOINCREMENT,
        id                TEXT,
        due_at            TEXT,
        unlock_at         TEXT,
        lock_at           TEXT,
        points_possible   REAL,
        grading_type      TEXT,
        assignment_group_id TEXT,     -- 외부 시스템/Canvas의 ID (문자열)
        grading_standard_id TEXT,
        created_at        TEXT,
        updated_at        TEXT,
        peer_reviews                       INTEGER,
        automatic_peer_reviews             INTEGER,
        position                           INTEGER,
        grade_group_students_individually  INTEGER,
        anonymous_peer_reviews             INTEGER,
        group_category_id                  TEXT,
        post_to_sis                        INTEGER,
        moderated_grading                  INTEGER,
        omit_from_final_grade              INTEGER,
        intra_group_peer_reviews           INTEGER,
        anonymous_instructor_annotations   INTEGER,
        anonymous_grading                  INTEGER,
        graders_anonymous_to_graders       INTEGER,
        grader_count                       INTEGER,
        grader_comments_visible_to_graders INTEGER,
        final_grader_id                    TEXT,
        grader_names_visible_to_final_grader INTEGER,
        allowed_attempts                   INTEGER,
        secure_params                      TEXT,
        course_id                          TEXT,
        name                               TEXT,
        submission_types                   TEXT,   -- JSON array
        has_submitted_submissions          INTEGER,
        due_date_required                  INTEGER,
        max_name_length                    INTEGER,
        is_quiz_assignment                 INTEGER,
        can_duplicate                      INTEGER,
        original_course_id                 TEXT,
        original_assignment_id             TEXT,
        original_assignment_name           TEXT,
        original_quiz_id                   TEXT,
        workflow_state                     TEXT,
        muted                              INTEGER,
        html_url                           TEXT,
        published                          INTEGER,
        only_visible_to_overrides          INTEGER,
        locked_for_user                    INTEGER,
        submissions_download_url           TEXT,
        post_manually                      INTEGER,
        anonymize_students                 INTEGER,
        require_lockdown_browser           INTEGER,
        in_closed_grading_period           INTEGER,

        -- DB 내부에서 AssignmentGroups 와 1:N 관계
        assignment_group_fk INTEGER,
        FOREIGN KEY (assignment_group_fk) REFERENCES AssignmentGroups(assignment_group_pk)
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
   * ModuleGroup INSERT
   */
  public insertModuleGroup(m: ModuleGroup): number {
    const stmt = this.db.prepare(`
      INSERT INTO ModuleGroups (
        completed_at,
        id,
        item_count,
        item_url,
        name,
        position,
        prerequisite_module_ids,
        publish_final_grade,
        require_sequential_progress,
        state,
        unlock_at
      ) VALUES (
        @completed_at,
        @id,
        @item_count,
        @item_url,
        @name,
        @position,
        @prerequisite_module_ids,
        @publish_final_grade,
        @require_sequential_progress,
        @state,
        @unlock_at
      )
    `);
    const result = stmt.run({
      completed_at: m.completed_at,
      id: m.id,
      item_count: m.item_count,
      item_url: m.item_url,
      name: m.name,
      position: m.position,
      prerequisite_module_ids: this.toJson(m.prerequisite_module_ids), // string[]
      publish_final_grade: this.boolToInt(m.publish_final_grade),
      require_sequential_progress: this.boolToInt(
        m.require_sequential_progress
      ),
      state: m.state,
      unlock_at: m.unlock_at,
    });
    return Number(result.lastInsertRowid);
  }

  /**
   * StudentModule INSERT
   */
  public insertStudentModule(s: StudentModule): number {
    const stmt = this.db.prepare(`
      INSERT INTO StudentModules (
        id,
        title,
        position,
        intent,
        type,
        module_id,
        html_url,
        content_id,
        url,
        external_url
      ) VALUES (
        @id,
        @title,
        @position,
        @intent,
        @type,
        @module_id,
        @html_url,
        @content_id,
        @url,
        @external_url
      )
    `);
    const result = stmt.run({
      id: s.id,
      title: s.title,
      position: s.position,
      intent: s.intent,
      type: s.type,
      module_id: s.module_id,
      html_url: s.html_url,
      content_id: s.content_id,
      url: s.url,
      external_url: s.external_url,
    });
    return Number(result.lastInsertRowid);
  }

  /**
   * AssignmentGroup INSERT
   * -> 내부에 assignments: Assignment[] 가 있으므로, 1:N 관계를 맺어둔
   *    Assignments 테이블에 각각 insertAssignment()를 호출할 수 있습니다.
   */
  public insertAssignmentGroup(ag: AssignmentGroup): number {
    const stmt = this.db.prepare(`
      INSERT INTO AssignmentGroups (
        id,
        name,
        position,
        group_weight,
        sis_source_id,
        integration_data,
        rules,
        any_assignment_in_closed_grading_period
      ) VALUES (
        @id,
        @name,
        @position,
        @group_weight,
        @sis_source_id,
        @integration_data,
        @rules,
        @any_assignment_in_closed_grading_period
      )
    `);
    const result = stmt.run({
      id: ag.id,
      name: ag.name,
      position: ag.position,
      group_weight: ag.group_weight,
      sis_source_id: ag.sis_source_id,
      integration_data: ag.integration_data,
      rules: ag.rules,
      any_assignment_in_closed_grading_period: this.boolToInt(
        ag.any_assignment_in_closed_grading_period
      ),
    });

    // AssignmentGroup 삽입 후, 연결된 Assignments도 차례로 INSERT
    const assignmentGroupPk = Number(result.lastInsertRowid);
    if (ag.assignments?.length) {
      for (const assignment of ag.assignments) {
        this.insertAssignment(assignment, assignmentGroupPk);
      }
    }

    return assignmentGroupPk;
  }

  /**
   * Assignment INSERT
   * -> assignmentGroupPk를 받아와서 assignment_group_fk로 저장
   */
  public insertAssignment(a: Assignment, assignmentGroupPk?: number): number {
    const stmt = this.db.prepare(`
      INSERT INTO Assignments (
        id,
        due_at,
        unlock_at,
        lock_at,
        points_possible,
        grading_type,
        assignment_group_id,
        grading_standard_id,
        created_at,
        updated_at,
        peer_reviews,
        automatic_peer_reviews,
        position,
        grade_group_students_individually,
        anonymous_peer_reviews,
        group_category_id,
        post_to_sis,
        moderated_grading,
        omit_from_final_grade,
        intra_group_peer_reviews,
        anonymous_instructor_annotations,
        anonymous_grading,
        graders_anonymous_to_graders,
        grader_count,
        grader_comments_visible_to_graders,
        final_grader_id,
        grader_names_visible_to_final_grader,
        allowed_attempts,
        secure_params,
        course_id,
        name,
        submission_types,
        has_submitted_submissions,
        due_date_required,
        max_name_length,
        is_quiz_assignment,
        can_duplicate,
        original_course_id,
        original_assignment_id,
        original_assignment_name,
        original_quiz_id,
        workflow_state,
        muted,
        html_url,
        published,
        only_visible_to_overrides,
        locked_for_user,
        submissions_download_url,
        post_manually,
        anonymize_students,
        require_lockdown_browser,
        in_closed_grading_period,
        assignment_group_fk
      ) VALUES (
        @id,
        @due_at,
        @unlock_at,
        @lock_at,
        @points_possible,
        @grading_type,
        @assignment_group_id,
        @grading_standard_id,
        @created_at,
        @updated_at,
        @peer_reviews,
        @automatic_peer_reviews,
        @position,
        @grade_group_students_individually,
        @anonymous_peer_reviews,
        @group_category_id,
        @post_to_sis,
        @moderated_grading,
        @omit_from_final_grade,
        @intra_group_peer_reviews,
        @anonymous_instructor_annotations,
        @anonymous_grading,
        @graders_anonymous_to_graders,
        @grader_count,
        @grader_comments_visible_to_graders,
        @final_grader_id,
        @grader_names_visible_to_final_grader,
        @allowed_attempts,
        @secure_params,
        @course_id,
        @name,
        @submission_types,
        @has_submitted_submissions,
        @due_date_required,
        @max_name_length,
        @is_quiz_assignment,
        @can_duplicate,
        @original_course_id,
        @original_assignment_id,
        @original_assignment_name,
        @original_quiz_id,
        @workflow_state,
        @muted,
        @html_url,
        @published,
        @only_visible_to_overrides,
        @locked_for_user,
        @submissions_download_url,
        @post_manually,
        @anonymize_students,
        @require_lockdown_browser,
        @in_closed_grading_period,
        @assignment_group_fk
      )
    `);
    const result = stmt.run({
      id: a.id,
      due_at: a.due_at,
      unlock_at: a.unlock_at,
      lock_at: a.lock_at,
      points_possible: a.points_possible,
      grading_type: a.grading_type,
      assignment_group_id: a.assignment_group_id,
      grading_standard_id: a.grading_standard_id,
      created_at: a.created_at,
      updated_at: a.updated_at,
      peer_reviews: this.boolToInt(a.peer_reviews),
      automatic_peer_reviews: this.boolToInt(a.automatic_peer_reviews),
      position: a.position,
      grade_group_students_individually: this.boolToInt(
        a.grade_group_students_individually
      ),
      anonymous_peer_reviews: this.boolToInt(a.anonymous_peer_reviews),
      group_category_id: a.group_category_id,
      post_to_sis: this.boolToInt(a.post_to_sis),
      moderated_grading: this.boolToInt(a.moderated_grading),
      omit_from_final_grade: this.boolToInt(a.omit_from_final_grade),
      intra_group_peer_reviews: this.boolToInt(a.intra_group_peer_reviews),
      anonymous_instructor_annotations: this.boolToInt(
        a.anonymous_instructor_annotations
      ),
      anonymous_grading: this.boolToInt(a.anonymous_grading),
      graders_anonymous_to_graders: this.boolToInt(
        a.graders_anonymous_to_graders
      ),
      grader_count: a.grader_count,
      grader_comments_visible_to_graders: this.boolToInt(
        a.grader_comments_visible_to_graders
      ),
      final_grader_id: a.final_grader_id,
      grader_names_visible_to_final_grader: this.boolToInt(
        a.grader_names_visible_to_final_grader
      ),
      allowed_attempts: a.allowed_attempts,
      secure_params: a.secure_params,
      course_id: a.course_id,
      name: a.name,
      submission_types: this.toJson(a.submission_types), // string[]
      has_submitted_submissions: this.boolToInt(a.has_submitted_submissions),
      due_date_required: this.boolToInt(a.due_date_required),
      max_name_length: a.max_name_length,
      is_quiz_assignment: this.boolToInt(a.is_quiz_assignment),
      can_duplicate: this.boolToInt(a.can_duplicate),
      original_course_id: a.original_course_id,
      original_assignment_id: a.original_assignment_id,
      original_assignment_name: a.original_assignment_name,
      original_quiz_id: a.original_quiz_id,
      workflow_state: a.workflow_state,
      muted: this.boolToInt(a.muted),
      html_url: a.html_url,
      published: this.boolToInt(a.published),
      only_visible_to_overrides: this.boolToInt(a.only_visible_to_overrides),
      locked_for_user: this.boolToInt(a.locked_for_user),
      submissions_download_url: a.submissions_download_url,
      post_manually: this.boolToInt(a.post_manually),
      anonymize_students: this.boolToInt(a.anonymize_students),
      require_lockdown_browser: this.boolToInt(a.require_lockdown_browser),
      in_closed_grading_period: this.boolToInt(a.in_closed_grading_period),
      assignment_group_fk: assignmentGroupPk ?? null,
    });
    return Number(result.lastInsertRowid);
  }

  public getCourse(courseId: string): Course {
    const stmt = this.db.prepare(`
      SELECT * FROM Courses WHERE id = @courseId
    `);
    return stmt.get({ courseId });
  }

  public getNotification(courseId: string): Notification[] {
    const stmt = this.db.prepare(`
      SELECT * FROM Notifications WHERE course_id = @courseId
    `);
    return stmt.all({ courseId });
  }

  public getModules(courseId: string): ModuleGroup[] {
    const stmt = this.db.prepare(`
      SELECT * FROM ModuleGroups WHERE course_id = @courseId
    `);
    return stmt.all({ courseId });
  }

  public getModuleItems(courseId: string, moduleId: string): StudentModule[] {
    const stmt = this.db.prepare(`
      SELECT * FROM StudentModules WHERE course_id = @courseId AND module_id = @moduleId
    `);
    return stmt.all({ courseId, moduleId });
  }

  public getAssignments(courseId: string): AssignmentGroup[] {
    const stmt = this.db.prepare(`
      SELECT * FROM AssignmentGroups WHERE course_id = @courseId
    `);
    return stmt.all({ courseId });
  }

  public getAssignmentItems(
    courseId: string,
    assignment_group_id: string
  ): Assignment[] {
    const stmt = this.db.prepare(`
      SELECT * FROM Assignments WHERE course_id = @courseId AND assignment_group_id = @assignment_group_id
    `);
    return stmt.all({ courseId, assignment_group_id });
  }

  public getCourses(): Course[] {
    const stmt = this.db.prepare(`
      SELECT * FROM Courses WHERE isFavorite = 1
    `);
    return stmt.all();
  }

  public deleteAll() {
    this.db.exec(`
      DELETE FROM Users;
      DELETE FROM Courses;
      DELETE FROM Grades;
      DELETE FROM Enrollments;
      DELETE FROM Folders;
      DELETE FROM UsersFull;
      DELETE FROM Plannables;
      DELETE FROM PlannableNotifications;
      DELETE FROM Notifications;
      DELETE FROM Submissions;
      DELETE FROM Attachments;
      DELETE FROM ModuleGroups;
      DELETE FROM StudentModules;
      DELETE FROM AssignmentGroups;
      DELETE FROM Assignments;
    `);
  }
}

export default MyDatabase;

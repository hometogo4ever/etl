import { User } from "./User";

export class Attachment {
  id: string;
  uuid: string;
  folder_id: string;
  display_name: string;
  filename: string;
  upload_status: string;
  content_type: string;
  url: string;
  size: number;
  created_at: string;
  updated_at: string;
  unlock_at: string;
  locked: boolean;
  hidden: boolean;
  lock_at: string;
  hidden_for_user: boolean;
  thumbnail_url: string;
  mime_class: string;
  modified_at: string;
  locked_for_user: boolean;
  user: User;

  constructor(
    id: string,
    uuid: string,
    folder_id: string,
    display_name: string,
    filename: string,
    upload_status: string,
    content_type: string,
    url: string,
    size: number,
    created_at: string,
    updated_at: string,
    unlock_at: string,
    locked: boolean,
    hidden: boolean,
    lock_at: string,
    hidden_for_user: boolean,
    thumbnail_url: string,
    mime_class: string,
    modified_at: string,
    locked_for_user: boolean,
    user: User
  ) {
    this.id = id;
    this.uuid = uuid;
    this.folder_id = folder_id;
    this.display_name = display_name;
    this.filename = filename;
    this.upload_status = upload_status;
    this.content_type = content_type;
    this.url = url;
    this.size = size;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.unlock_at = unlock_at;
    this.locked = locked;
    this.hidden = hidden;
    this.lock_at = lock_at;
    this.hidden_for_user = hidden_for_user;
    this.thumbnail_url = thumbnail_url;
    this.mime_class = mime_class;
    this.modified_at = modified_at;
    this.locked_for_user = locked_for_user;
    this.user = user;
  }
}

export class Folder {
  id: string;
  name: string;
  full_name: string;
  context_id: string;
  context_type: string;
  parent_folder_id: string;
  created_at: string;
  updated_at: string;
  lock_at: string;
  unlock_at: string;
  position: number;
  locked: boolean;
  folders_url: string;
  files_url: string;
  files_count: number;
  folders_count: number;
  hidden: boolean;
  locked_for_user: boolean;
  hidden_for_user: boolean;
  for_submissions: boolean;
  can_upload: boolean;

  constructor(
    id: string,
    name: string,
    full_name: string,
    context_id: string,
    context_type: string,
    parent_folder_id: string,
    created_at: string,
    updated_at: string,
    lock_at: string,
    unlock_at: string,
    position: number,
    locked: boolean,
    folders_url: string,
    files_url: string,
    files_count: number,
    folders_count: number,
    hidden: boolean,
    locked_for_user: boolean,
    hidden_for_user: boolean,
    for_submissions: boolean,
    can_upload: boolean
  ) {
    this.id = id;
    this.name = name;
    this.full_name = full_name;
    this.context_id = context_id;
    this.context_type = context_type;
    this.parent_folder_id = parent_folder_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.lock_at = lock_at;
    this.unlock_at = unlock_at;
    this.position = position;
    this.locked = locked;
    this.folders_url = folders_url;
    this.files_url = files_url;
    this.files_count = files_count;
    this.folders_count = folders_count;
    this.hidden = hidden;
    this.locked_for_user = locked_for_user;
    this.hidden_for_user = hidden_for_user;
    this.for_submissions = for_submissions;
    this.can_upload = can_upload;
  }
}

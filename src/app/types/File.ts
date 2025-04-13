export class ETLFile {
  constructor(
    public canvadoc_session_url: string,
    public contentType: string,
    public created_at: string,
    public crocodoc_session_url: string,
    public display_name: string,
    public filename: string,
    public folder_id: string,
    public hidden: boolean,
    public hidden_for_user: boolean,
    public id: string,
    public lock_at: string,
    public locked_for_user: boolean,
    public locked: boolean,
    public media_entity_id: string,
    public mime_class: string,
    public modified_at: string,
    public size: number,
    public thumbnail_url: string,
    public unlock_at: string,
    public upload_status: string,
    public url: string,
    public uuid: string
  ) {}
}

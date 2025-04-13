export class ETLFolder {
  constructor(
    public can_upload: boolean,
    public context_id: string,
    public context_type: string,
    public created_at: string,
    public files_count: number,
    public files_url: string,
    public folders_count: number,
    public folders_url: string,
    public for_submissions: boolean,
    public full_name: string,
    public hidden: boolean,
    public hidden_for_user: boolean,
    public id: string,
    public lock_at: string,
    public locked: boolean,
    public locked_for_user: boolean,
    public name: string,
    public parent_folder_id: string,
    public position: number,
    public unlock_at: string,
    public updated_at: string
  ) {}
}

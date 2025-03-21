export class ModuleGroup {
  constructor(
    public completed_at: string,
    public id: string,
    public item_count: number,
    public item_url: string,
    public name: string,
    public position: number,
    public prerequisite_module_ids: string[],
    public publish_final_grade: boolean,
    public require_sequential_progress: boolean,
    public state: string,
    public unlock_at: string
  ) {}
}

export class StudentModule {
  constructor(
    public id: string,
    public title: string,
    public position: number,
    public intent: number,
    public type: string,
    public module_id: string,
    public html_url: string,
    public content_id: number,
    public url: string,
    public external_url: string
  ) {}
}

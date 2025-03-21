import { Assignment } from "./Assignment";

export class AssignmentGroup {
  constructor(
    public id: string,
    public name: string,
    public position: number,
    public group_weight: number,
    public sis_source_id: string,
    public integration_data: string,
    public rules: string,
    public assignments: Assignment[],
    public any_assignment_in_closed_grading_period: boolean
  ) {}
}

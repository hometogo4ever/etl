export class Grade {
  html_url: string;
  current_score: number;
  current_grade: string;
  final_score: number;
  final_grade: string;

  constructor(
    html_url: string,
    current_score: number,
    current_grade: string,
    final_score: number,
    final_grade: string
  ) {
    this.html_url = html_url;
    this.current_score = current_score;
    this.current_grade = current_grade;
    this.final_score = final_score;
    this.final_grade = final_grade;
  }
}

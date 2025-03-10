export class Course {
  originalName: string;
  courseCode: string;
  assetString: string;
  href: string;
  term: string;
  id: string;
  isFavorite: boolean;

  constructor(
    originalName: string,
    courseCode: string,
    assetString: string,
    href: string,
    term: string,
    id: string,
    isFavorite: boolean
  ) {
    this.originalName = originalName;
    this.courseCode = courseCode;
    this.assetString = assetString;
    this.href = href;
    this.term = term;
    this.id = id;
    this.isFavorite = isFavorite;
  }
}

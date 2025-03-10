import { Enrollment } from "./Enrollment";

export class User {
  id: number;
  display_name: string;
  avatar_image_url: string;
  html_url: string;

  constructor(
    id: number,
    display_name: string,
    avatar_image_url: string,
    html_url: string
  ) {
    this.id = id;
    this.display_name = display_name;
    this.avatar_image_url = avatar_image_url;
    this.html_url = html_url;
  }
}

export class UserFull {
  id: number;
  name: string;
  created_at: string;
  sortable_name: string;
  avatar_url: string;
  enrollments: Enrollment[];
  custom_links: string[];

  constructor(
    id: number,
    name: string,
    created_at: string,
    sortable_name: string,
    avatar_url: string,
    enrollments: Enrollment[],
    custom_links: string[]
  ) {
    this.id = id;
    this.name = name;
    this.created_at = created_at;
    this.sortable_name = sortable_name;
    this.avatar_url = avatar_url;
    this.enrollments = enrollments;
    this.custom_links = custom_links;
  }
}

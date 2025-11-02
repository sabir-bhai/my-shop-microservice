export interface Banner {
  id: string;
  title: string;
  link?: string;
  status: "active" | "inactive";
  image?: string;
  created: string;
  updated: string;
}

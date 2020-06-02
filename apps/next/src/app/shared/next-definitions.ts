/** Main navigation */
export interface Nav {
  navItems: NavItem[];
}

export interface NavItem {
  label: string;
  url: string;
  order?: number;
}

export interface NextPage {
  content: string;
  group: string;
  section: string;
}

export enum NextContentType {
  NextPages = 'nextpages',
}

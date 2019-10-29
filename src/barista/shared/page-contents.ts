export interface BaPageContents {
  title: string;
  description: string;
  id: string;
  layout: 'default' | 'overview' | 'icon' | 'index';
}

export interface BaIndexPageContents extends BaPageContents {
  subtitle: string;
  mostordered: BaIndexPageItem[];
  recentlyordered: BaIndexPageItem[];
  gettingstarted: BaIndexPageLink[];
}

export interface BaSinglePageContents extends BaPageContents {
  layout: 'default';
  contributors?: {
    ux: string[];
    dev: string[];
  };
  category: string;
  tags: string[];
  related: string[];
  properties: string[] | null;
  wiki: string | null;
  themable: boolean | null;
  contentHtml: string | null;
  contentMarkdown: string | null;
  indentifier: string;
}

export interface BaOverviewPageSectionItem {
  identifier: string;
  title: string;
  category: string;
  badge: string;
  link: string;
  description: string;
}

export interface BaOverviewPageSection {
  title: string;
  items: BaOverviewPageSectionItem[];
}

export interface BaIndexPageLink {
  title: string;
  text: string;
  link: string;
  bordercolor: string;
}

export interface BaIndexPageItem {
  title?: string;
  identifier?: string;
  link?: string;
  category?: string;
  isEmpty?: boolean;
}

export interface BaOverviewPageContents extends BaPageContents {
  sections: BaOverviewPageSection[];
}

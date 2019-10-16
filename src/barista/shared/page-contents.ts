export interface BaPageContents {
  title: string;
  description: string;
  id: string;
  layout: 'default' | 'overview' | 'icon';
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

export interface BaOverviewPageContents extends BaPageContents {
  sections: BaOverviewPageSection[];
}

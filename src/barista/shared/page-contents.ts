export interface BaPageContents {
  title: string;
  description: string;
  id: string;
  layout: 'default' | 'overview' | 'icon';
  contributors: {
    ux: string[];
    dev: string[];
  };
  tags: string[];
  related: string[];
  contentHtml: string | null;
  contentMarkdown: string | null;
}

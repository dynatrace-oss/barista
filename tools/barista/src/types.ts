export type BaPageTransformer = (
  source: BaPageContent,
) => Promise<BaPageContent>;

// tslint:disable-next-line: no-any
export type BaPageBuilder = (...args: any[]) => Promise<BaPageBuildResult[]>;

export interface BaPageBuildResult {
  relativeOutFile: string;
  pageContent: BaPageContent;
}

/** Contributors in page front matter */
export interface BaContributors {
  dev: string[];
  ux: string[];
}

/** Structure of the generated JSON page output */
export interface BaPageContent {
  title?: string;
  layout?: string;
  content?: string;
  description?: string;
  public?: boolean;
  contributors?: BaContributors;
  toc?: boolean;
  themable?: boolean;
  wiki?: string;
  properties?: string[];
  tags?: string[];
  related?: string[];
  nav_group?: string;
  category?: string;
}

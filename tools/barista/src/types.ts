export type BaPageTransformer = (
  source: BaPageContent,
) => Promise<BaPageContent>;

// tslint:disable-next-line: no-any
export type BaPageBuilder = (...args: any[]) => Promise<BaPageBuildResult[]>;

export interface BaPageBuildResult {
  relativeOutFile: string;
  pageContent: BaPageContent;
}

/** Structure of the generated JSON page output */
export interface BaPageContent {
  title?: string;
  layout?: string;
  content?: string;
  description?: string;
  properties?: string[];
  tags?: string[];
  nav_group?: string;
}

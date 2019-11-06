import { load as loadWithCheerio } from 'cheerio';
import * as matter from 'gray-matter';
import * as markdownIt from 'markdown-it';

import { BaPageContent, BaPageTransformer } from './types';

const markdown = new markdownIt({
  html: true,
  typographer: false,
});

/** Transforms the page-content object by applying each provided transformer in order */
export async function transformPage(
  source: BaPageContent,
  transformers: BaPageTransformer[],
): Promise<BaPageContent> {
  return transformers.reduce<Promise<BaPageContent>>(
    async (aggregatedPage, transformer) => transformer(await aggregatedPage),
    Promise.resolve(source),
  );
}

/** Enriches the page-content object with front-matter data. */
export const frontMatterTransformer: BaPageTransformer = async source => {
  const transformed = { ...source };
  if (source.content && source.content.length) {
    const frontMatter = matter(source.content);
    transformed.title = source.title || frontMatter.data.title || '';
    transformed.description =
      source.description || frontMatter.data.description || '';
    transformed.layout =
      source.layout || frontMatter.data.layout || 'component';
    transformed.content = frontMatter.content || '';
    transformed.properties =
      source.properties || frontMatter.data.properties || [];
    transformed.tags = source.tags || frontMatter.data.tags || [];
  }
  return transformed;
};

/** Transforms a markdown content into html. */
export const markdownToHtmlTransformer: BaPageTransformer = async source => {
  const transformed = { ...source };
  if (source.content && source.content.length) {
    transformed.content = markdown.render(source.content);
  }
  return transformed;
};

/** Sets additional tags for component pages. */
export const componentTagsTransformer: BaPageTransformer = async source => {
  const transformed = { ...source };
  const sourceTags = source.tags || [];
  const tagSet = new Set([...['component', 'angular'], ...sourceTags]);
  transformed.tags = Array.from(tagSet);
  return transformed;
};

/** Transforms UX slots from within the content and enriches slots with UX content */
export const uxSlotTransformer: BaPageTransformer = async source => {
  const transformed = { ...source };
  // TODO lara
  // lookup slot tags in content
  // foreach fetch from cms
  // replace slot tags with fetched stuff
  return transformed;
};

/** Extracts H1 headlines and sets the title if possible. */
export const extractH1ToTitleTransformer: BaPageTransformer = async source => {
  const transformed = { ...source };
  if (source.content && source.content.length) {
    const content = loadWithCheerio(source.content, { xmlMode: true });

    const headlines = content('h1');
    if (headlines.length) {
      if (!transformed.title) {
        transformed.title = headlines.first().text();
      }
      headlines.remove();
      transformed.content = content.html() || '';
    }
  }
  return transformed;
};

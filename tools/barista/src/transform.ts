/**
 * @license
 * Copyright 2019 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { load as loadWithCheerio } from 'cheerio';
import * as markdownIt from 'markdown-it';
import * as markdownItDeflist from 'markdown-it-deflist';

import {
  BaSinglePageContent,
  BaPageTransformer,
} from '@dynatrace/barista-components/barista-definitions';

const markdown = new markdownIt({
  html: true,
  typographer: false,
}).use(markdownItDeflist);

/** Transforms the page-content object by applying each provided transformer in order */
export async function transformPage(
  source: BaSinglePageContent,
  transformers: BaPageTransformer[],
): Promise<BaSinglePageContent> {
  return transformers.reduce<Promise<BaSinglePageContent>>(
    async (aggregatedPage, transformer) => transformer(await aggregatedPage),
    Promise.resolve(source),
  );
}

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

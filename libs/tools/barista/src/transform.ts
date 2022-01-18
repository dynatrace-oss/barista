/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import {
  BaAllExamplesMetadata,
  BaSinglePageContent,
  TableOfContents,
} from '@dynatrace/shared/design-system/interfaces';
import * as markdownIt from 'markdown-it';
import * as markdownItDeflist from 'markdown-it-deflist';
import { environment } from '@environments/barista-environment';
import { isPublicBuild } from '@dynatrace/shared/node';
import { baElementBlockIgnore } from './markdown-custom-elements-ignore';
import { fetchContentList } from '@dynatrace/shared/data-access-strapi';
import { runWithCheerio } from './utils/run-with-cheerio';
import { parse } from 'url';

import {
  BaStrapiContentType,
  BaStrapiSnippet,
  BaPageTransformer,
} from './types';

const markdown = new markdownIt({
  html: true,
  typographer: false,
}).use(markdownItDeflist);

markdown.block.ruler.before('html_block', 'custom_block', baElementBlockIgnore);

/**
 * Holds all UX content snippets fetched from Strapi.
 */
const strapiSnippetCache = new Map<string, BaStrapiSnippet>();

async function getSnippetData(): Promise<void> {
  if (strapiSnippetCache.size > 0 || !environment.strapiEndpoint) {
    return;
  }
  const strapiSnippets = await fetchContentList<BaStrapiSnippet>(
    BaStrapiContentType.Snippets,
    { publicContent: isPublicBuild() },
    environment.strapiEndpoint!,
  );

  for (const snippet of strapiSnippets) {
    // Only cache the snippet if it has actual content
    if (snippet.content.trim().length > 0) {
      strapiSnippetCache.set(snippet.slotId, snippet);
    }
  }
}

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
export const markdownToHtmlTransformer: BaPageTransformer = async (source) => {
  const transformed = { ...source };
  if (source.content && source.content.length) {
    transformed.content = markdown.render(source.content);
  }
  return transformed;
};

/** Sets additional tags for component pages. */
export const componentTagsTransformer: BaPageTransformer = async (source) => {
  const transformed = { ...source };
  const sourceTags = source.tags || [];
  const tagSet = new Set([...['component', 'angular'], ...sourceTags]);
  transformed.tags = Array.from(tagSet);
  return transformed;
};

/** Transforms UX slots from within the content and enriches slots with UX content from Strapi snippets. */
export const uxSnippetTransformer: BaPageTransformer = async (source) => {
  const transformed = { ...source };
  await getSnippetData();
  if (source.content && source.content.length) {
    transformed.content = runWithCheerio(source.content, ($) => {
      const snippetSlots = $('ba-ux-snippet');
      if (snippetSlots.length) {
        snippetSlots.each((_, slot) => {
          const snippetName = $(slot).attr('name') || '';
          const snippetData = strapiSnippetCache.get(snippetName);
          if (snippetData) {
            const snippetHTMLContent = markdown.render(snippetData.content);
            $(slot).replaceWith($(snippetHTMLContent));
          }
        });
      }
    });
  }
  return transformed;
};

/** Extracts H1 headlines and sets the title if possible. */
export const extractH1ToTitleTransformer: BaPageTransformer = async (
  source,
) => {
  const transformed = { ...source };
  if (source.content && source.content.length) {
    transformed.content = runWithCheerio(source.content, ($) => {
      const headlines = $('h1');
      if (headlines.length) {
        if (!transformed.title) {
          transformed.title = headlines.first().text();
        }
        headlines.remove();
      }
    });
  }
  return transformed;
};

/** Adds ids to each headline on the page. */
export const headingIdTransformer: BaPageTransformer = async (source) => {
  const transformed = { ...source };
  if (source.content && source.content.length) {
    const headlinesLookup = new Map<string, number>();
    transformed.content = runWithCheerio(source.content, ($) => {
      const headlines = $('h2, h3, h4, h5, h6');
      if (headlines.length) {
        headlines.each((_, headline) => {
          const text = $(headline).text();
          const headlineId = text
            .toLowerCase()
            .replace(/&amp;/g, '')
            .replace(/&/g, '')
            .replace(/\?/g, '')
            .replace(/!/g, '')
            .replace(/\//g, '')
            .replace(/’/g, '')
            .replace(/"/g, '')
            .replace(/:/g, '')
            .replace(/;/g, '')
            .replace(/,/g, '')
            .replace(/\./g, '')
            .replace(/\(/g, '')
            .replace(/\)/g, '')
            .replace(/[^\w<>]+/g, '-')
            // avoid IDs starting with a number
            .replace(/^(\d+)/g, 'h$1');

          /*
           * Handle duplicate Ids on one page by adding a counter
           * after the Id string when there's more than one.
           */
          let headlineCount = headlinesLookup.get(headlineId);
          if (headlineCount) {
            headlinesLookup.set(headlineId, ++headlineCount);
          } else {
            headlinesLookup.set(headlineId, 1);
          }
          $(headline).attr(
            'id',
            headlineCount ? `${headlineId}-${headlineCount}` : headlineId,
          );
        });
      }
    });
  }
  return transformed;
};

/** Adds a class to a headline element named after the tagname of the element (e.g <h1>...</h1> -> <h1 class="h1">...</h1>) */
export const headlineClassTransformer: BaPageTransformer = async (source) => {
  const transformed = { ...source };
  if (source.content && source.content.length) {
    transformed.content = runWithCheerio(source.content, ($) => {
      const headlines = $('h1, h2, h3, h4, h5, h6');
      headlines.each((_: number, headline) => {
        $(headline).addClass(headline.tagName);
      });
    });
  }
  return transformed;
};

/** Adds ids to each headline on the page. */
export const copyHeadlineTransformer: BaPageTransformer = async (source) => {
  const transformed = { ...source };
  if (source.content && source.content.length) {
    transformed.content = runWithCheerio(source.content, ($) => {
      const headlines = $('h2, h3, h4, h5, h6');
      if (headlines.length) {
        headlines.each((_, headline) => {
          const id = $(headline).attr('id');
          const headlineLink = `<ba-headline-link id="${id}"></ba-headline-link>`;
          $(headline).append(headlineLink);
        });
      }
    });
  }
  return transformed;
};

/** Replaces absolute href with contentLink */
export const relativeUrlTransformer: BaPageTransformer = async (source) => {
  const transformed = { ...source };
  if (source.content && source.content.length) {
    transformed.content = runWithCheerio(source.content, ($) => {
      const links = $('a');
      links.each((_: number, link) => {
        const linkValue = $(link).attr('href');
        if (linkValue && !isQualifiedLink(linkValue)) {
          const url = parse(linkValue);
          // Link Value
          $(link)
            .removeAttr('href')
            .attr('contentLink', url.pathname || '/');
          // Fragment
          if (url.hash) {
            $(link).attr('fragment', url.hash.replace('#', ''));
          }
          // QueryParam
          if (url.query) {
            $(link).attr('queryParams', toQueryParamValue(url.query));
          }
        }
      });
    });
  }
  return transformed;
};

/** generates a toc json containing headlines with children */
export const tableOfContentGenerator: BaPageTransformer = async (source) => {
  const transformed = { ...source };
  const items: TableOfContents[] = [];
  if (source.toc) {
    try {
      // generate TOC and at to source
      // Find Headlines and corresponding subheadlines (h2 > h3)
      transformed.content = runWithCheerio(source.content, ($) => {
        const headlines = $('h2, h3');

        headlines.each((_index: number, headlineElement) => {
          const id = `${$(headlineElement).attr('id')}`;
          const headline = `${$(headlineElement).text()}`;
          const item: TableOfContents = {
            level: parseInt(headlineElement.tagName.slice(1), 10),
            id,
            headline,
            children: [],
          };

          const lastItemIndex = items.length - 1;
          if (lastItemIndex < 0 || items[lastItemIndex].level >= item.level) {
            items.push(item);
          } else {
            // find the next parent headline to put the children in
            for (let i = items.length - 1; i >= 0; i--) {
              if (items[i].level < item.level) {
                items[i].children.push(item);
                break;
              }
            }
          }
        });
      });
    } catch (error) {
      console.error(`Failed to generate TOC for: ${source.title}`);
    }
  }
  transformed.tocitems = items;
  return transformed;
};

/** Removes internal links from the content on public build. */
export function internalLinksTransformerFactory(
  isPublic: boolean,
  internalLinkParts: string[],
): BaPageTransformer {
  return async (source) => {
    if (!isPublic || !internalLinkParts.length) {
      return source;
    }

    const transformed = { ...source };
    const internalLinkSelectors = internalLinkParts
      .map((selector) => `a[href*="${selector}"]`)
      .join(',');

    transformed.content = runWithCheerio(source.content, ($) => {
      const internalLinksElements = $(internalLinkSelectors);
      if (internalLinksElements.length) {
        internalLinksElements.each((_, link) => {
          $(link).attr('href', '#');
          $(link).addClass('ba-internal-url');
        });
      }
    });
    return transformed;
  };
}

export function exampleInlineSourcesTransformerFactory(
  metadata: BaAllExamplesMetadata,
): BaPageTransformer {
  return async (source) => {
    source.content = runWithCheerio(source.content, ($) => {
      $('ba-live-example').each((_index, element) => {
        const name = $(element).attr('name') || '';
        const demoMetadata = metadata[name];
        if (!demoMetadata) {
          throw new Error(`Example with name ${name} does not exist`);
        }
        if (demoMetadata.directory) {
          $(element).attr('directory', demoMetadata.directory);
        }
        if (demoMetadata.templateSource) {
          $(element).attr('templateSource', demoMetadata.templateSource);
        }
        if (demoMetadata.classSource) {
          $(element).attr('classSource', demoMetadata.classSource);
        }
        if (demoMetadata.stylesSource) {
          $(element).attr('stylesSource', demoMetadata.stylesSource);
        }
      });
    });
    return source;
  };
}

/**
 * Removes internal content wrapped with <ba-internal-content>
 * from Strapi pages on public build.
 */
export function internalContentTransformerFactory(
  isPublic: boolean,
): BaPageTransformer {
  return async (source) => {
    const transformed = { ...source };

    // Content replacement only seems to work if there is at least one empty line
    // between the opening/closing tag and the actual content. To ensure that this
    // is the case, the following string replacement is needed.
    const sanitizedContent = source.content.replace(
      /<\/?ba-internal-content>/g,
      '\n\n$&\n\n',
    );

    transformed.content = runWithCheerio(sanitizedContent, ($) => {
      $('ba-internal-content').each((_, content) => {
        if (isPublic) {
          $(content).remove();
        } else {
          const innerHtml = $(content).html();
          if (innerHtml) {
            // If the innerHtml starts with < we can assume that it's HTML content.
            // If not it's probably a string that can be wrapped in a paragraph.
            if (innerHtml.trim().startsWith('<')) {
              $(content).replaceWith($(innerHtml));
            } else {
              $(content).replaceWith($(`<p>${innerHtml}</p>`));
            }
          }
        }
      });
    });

    return transformed;
  };
}

/**
 * Checks whether a URL is a fully qualified link
 */
function isQualifiedLink(href: string): boolean {
  // Matches every character case insensitive until a colon is coming. Has to have at least one character.
  // https://regex101.com/r/nzwuR4/1
  return !!href.match(/^(?:[a-z]+:)?\/\//i);
}

/** Converts query parameters to a json object */
function toQueryParamValue(query: string): string {
  const params = new URLSearchParams(query);
  const queryParams: string[] = [];
  params.forEach((value, key) => {
    queryParams.push(`${key}: ${value}`);
  });
  return `{${queryParams.join(',')}}`;
}

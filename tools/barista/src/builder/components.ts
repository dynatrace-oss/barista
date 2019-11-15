import { BaPageBuildResult, BaPageBuilder, BaPageTransformer } from '../types';
import { basename, join } from 'path';
import {
  componentTagsTransformer,
  extractH1ToTitleTransformer,
  frontMatterTransformer,
  markdownToHtmlTransformer,
  transformPage,
  uxSlotTransformer,
} from '../transform';
import { existsSync, lstatSync, readFileSync, readdirSync } from 'fs';

import { BaOverviewPage } from '../../../../apps/barista/src/shared/page-contents';

// tslint:disable-next-line: no-any
export type BaComponentsPageBuilder = (...args: any[]) => BaPageBuildResult[];

const LIB_ROOT = join(__dirname, '../../../', 'components');

const TRANSFORMERS: BaPageTransformer[] = [
  frontMatterTransformer,
  componentTagsTransformer,
  markdownToHtmlTransformer,
  extractH1ToTitleTransformer,
  uxSlotTransformer,
];

export const componentOverview: BaOverviewPage = {
  title: 'Components',
  id: 'components',
  layout: 'overview',
  description:
    'Read all about development with/of our Angular components in how to get started. If you run into any troubles or want to contribute, please visit our GitHub page.',
  sections: [{
    title: 'Card',
    items: [],
  },
  {
    title: 'Selection area',
    items: [],
  },
  {
    title: 'Table',
    items: [],
  },
  ],
};

/** Page-builder for angular component pages. */
export const componentsBuilder: BaPageBuilder = async (
  componentsPaths?: string[],
) => {
  const paths =
    componentsPaths ||
    readdirSync(LIB_ROOT)
      .map(name => join(LIB_ROOT, name))
      .filter(dir => lstatSync(dir).isDirectory());

  // Only grab those dirs that include a README.md
  const readmeDirs = paths.filter(dir => existsSync(join(dir, 'README.md')));
  const transformed = [];
  for (const dir of readmeDirs) {
    const relativeOutFile = join('components', `${basename(dir)}.json`);
    const pageContent = await transformPage(
      {
        content: readFileSync(join(dir, 'README.md')).toString(),
      },
      TRANSFORMERS,
    );
    transformed.push({ pageContent, relativeOutFile });
    if (pageContent.title) {
      for (const section of componentOverview.sections) {
        if (section.title === pageContent.title) {
          section.items.push({
            title: pageContent.title,
            category: section.title.charAt(0).toUpperCase() + section.title.slice(1),
            identifier:
            pageContent.title && pageContent.title.length > 1
              ? pageContent.title[0] + pageContent.title[1]
              : 'Id',
            link: relativeOutFile,
            badge: pageContent.properties || [],
            description: pageContent.description || '',
          });
          console.log(pageContent.title);
        }
      }
    }
  }
  return transformed;
};

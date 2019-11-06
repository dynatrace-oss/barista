import { existsSync, lstatSync, readFileSync, readdirSync } from 'fs';
import { basename, join } from 'path';

import {
  componentTagsTransformer,
  extractH1ToTitleTransformer,
  frontMatterTransformer,
  markdownToHtmlTransformer,
  transformPage,
  uxSlotTransformer,
} from '../transform';
import { BaPageBuildResult, BaPageBuilder, BaPageTransformer } from '../types';

// tslint:disable-next-line: no-any
export type BaComponentsPageBuilder = (...args: any[]) => BaPageBuildResult[];

const LIB_ROOT = join(__dirname, '../../../', 'src', 'lib');

const TRANSFORMERS: BaPageTransformer[] = [
  frontMatterTransformer,
  componentTagsTransformer,
  markdownToHtmlTransformer,
  extractH1ToTitleTransformer,
  uxSlotTransformer,
];

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
  }
  return transformed;
};

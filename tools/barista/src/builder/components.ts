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

import { existsSync, lstatSync, readFileSync, readdirSync } from 'fs';
import { basename, join } from 'path';

import {
  componentTagsTransformer,
  extractH1ToTitleTransformer,
  markdownToHtmlTransformer,
  transformPage,
  uxSlotTransformer,
} from '../transform';
import { BaPageBuildResult, BaPageBuilder, BaPageTransformer } from '../types';

// tslint:disable-next-line: no-any
export type BaComponentsPageBuilder = (...args: any[]) => BaPageBuildResult[];

const LIB_ROOT = join(__dirname, '../../../', 'components');

const TRANSFORMERS: BaPageTransformer[] = [
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

  // Only grab those dirs that include a README.md and a barista.json
  const readmeDirs = paths.filter(
    dir =>
      existsSync(join(dir, 'README.md')) &&
      existsSync(join(dir, 'barista.json')),
  );
  const transformed = [];
  for (const dir of readmeDirs) {
    const relativeOutFile = join('components', `${basename(dir)}.json`);
    const baristaMetadata = JSON.parse(
      readFileSync(join(dir, 'barista.json')).toString(),
    );
    // Filter draft pages
    if (!baristaMetadata.draft) {
      const pageContent = await transformPage(
        {
          title: baristaMetadata.title,
          description: baristaMetadata.description,
          public: baristaMetadata.public || true,
          toc: baristaMetadata.toc || true,
          themable: baristaMetadata.themable || false,
          properties: baristaMetadata.properties,
          tags: baristaMetadata.tags,
          related: baristaMetadata.related,
          contributors: baristaMetadata.contributors,
          category: 'component',
          content: readFileSync(join(dir, 'README.md')).toString(),
        },
        TRANSFORMERS,
      );
      transformed.push({ pageContent, relativeOutFile });
    }
  }
  return transformed;
};

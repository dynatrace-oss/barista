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
import { basename, dirname, extname, join } from 'path';

import {
  BaPageBuildResult,
  BaPageBuilder,
  BaPageTransformer,
  BaSinglePageMeta,
  BaLayoutType,
} from '@dynatrace/barista-components/barista-definitions';

import {
  componentTagsTransformer,
  extractH1ToTitleTransformer,
  markdownToHtmlTransformer,
  transformPage,
  uxSlotTransformer,
} from '../transform';

import { slugify } from '../utils/slugify';

const PROJECT_ROOT = join(__dirname, '../../../');
const LIB_ROOT = join(__dirname, '../../../', 'components');
const DOCUMENTATION_ROOT = join(__dirname, '../../../', 'documentation');

const TRANSFORMERS: BaPageTransformer[] = [
  componentTagsTransformer,
  markdownToHtmlTransformer,
  extractH1ToTitleTransformer,
  uxSlotTransformer,
];

function getMarkdownFilesByPath(rootPath: string): string[] {
  return readdirSync(rootPath)
    .filter(name => extname(name) === '.md')
    .map(name => join(rootPath, name));
}

function setMetadataDefaults(baristaMetadata: any): BaSinglePageMeta {
  const metadataWithDefaults = {
    title: baristaMetadata.title,
    description: baristaMetadata.description,
    public:
      baristaMetadata.public === undefined ? true : baristaMetadata.public,
    toc: baristaMetadata.toc === undefined ? true : baristaMetadata.toc,
    themable: baristaMetadata.themable,
    properties: baristaMetadata.properties,
    tags: baristaMetadata.tags,
    related: baristaMetadata.related,
    contributors: baristaMetadata.contributors,
    category: 'component',
    layout: BaLayoutType.Default,
    order: baristaMetadata.order,
    navGroup: baristaMetadata.navGroup,
  };

  return metadataWithDefaults;
}

function getPaths(path: string): string[] {
  let fileList: string[] = [];

  // Only grab those dirs that include a README.md and a barista.json
  if (
    existsSync(join(path, 'README.md')) &&
    existsSync(join(path, 'barista.json'))
  ) {
    fileList.push(path);
  }

  let files = readdirSync(path);

  for (const file of files) {
    const filePath = join(path, file);
    if (lstatSync(filePath).isDirectory()) {
      fileList.push(...getPaths(filePath));
    }
  }

  return fileList;
}

/** Page-builder for angular component & documentation pages. */
export const componentsBuilder: BaPageBuilder = async (
  componentsPaths?: string[],
) => {
  let readmeDirs: string[] = [];

  if (componentsPaths) {
    for (const path of componentsPaths) {
      readmeDirs.push(...getPaths(path));
    }
  } else {
    readmeDirs = getPaths(LIB_ROOT);
  }

  const documentationMdFiles = [
    ...getMarkdownFilesByPath(DOCUMENTATION_ROOT),
    ...getMarkdownFilesByPath(PROJECT_ROOT),
  ];

  const transformed: BaPageBuildResult[] = [];

  // Handle component README.md and barista.json files
  for (const dir of readmeDirs) {
    const relativeOutFile = join('components', `${basename(dir)}.json`);
    const baristaMetadata = JSON.parse(
      readFileSync(join(dir, 'barista.json')).toString(),
    );
    // Filter draft pages
    if (!baristaMetadata.draft) {
      const pageContent = await transformPage(
        {
          ...setMetadataDefaults(baristaMetadata),
          content: readFileSync(join(dir, 'README.md')).toString(),
        },
        TRANSFORMERS,
      );
      transformed.push({ pageContent, relativeOutFile });
    }
  }

  // Handle component documentation files
  for (const filepath of documentationMdFiles) {
    const fileBasename = basename(filepath, '.md');
    const fileDir = dirname(filepath);

    const baristaMetadata = existsSync(join(fileDir, `${fileBasename}.json`))
      ? JSON.parse(
          readFileSync(join(fileDir, `${fileBasename}.json`)).toString(),
        )
      : undefined;

    // Filter pages without metadata or set to draft
    if (baristaMetadata && !baristaMetadata.draft) {
      const relativeOutFile = join(
        'components',
        `${slugify(baristaMetadata.title || basename(filepath, '.md'))}.json`,
      );
      const pageContent = await transformPage(
        {
          ...setMetadataDefaults(baristaMetadata),
          navGroup: 'docs',
          content: readFileSync(filepath).toString(),
        },
        TRANSFORMERS,
      );
      transformed.push({ pageContent, relativeOutFile });
    }
  }

  return transformed;
};

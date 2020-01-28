/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
import { environment } from 'tools/environments/barista-environment';

import {
  componentTagsTransformer,
  extractH1ToTitleTransformer,
  markdownToHtmlTransformer,
  transformPage,
  uxSnippetTransformer,
  headingIdTransformer,
  copyHeadlineTransformer,
} from '../transform';

import { slugify } from '../utils/slugify';

const PROJECT_ROOT = environment.rootDir;
const LIB_ROOT = join(PROJECT_ROOT, 'components');
const DOCUMENTATION_ROOT = join(PROJECT_ROOT, 'documentation');

const TRANSFORMERS: BaPageTransformer[] = [
  componentTagsTransformer,
  markdownToHtmlTransformer,
  extractH1ToTitleTransformer,
  uxSnippetTransformer,
  headingIdTransformer,
  copyHeadlineTransformer,
];

/** Returns all markdown files of a given path. */
function getMarkdownFilesByPath(rootPath: string): string[] {
  return readdirSync(rootPath)
    .filter(name => extname(name) === '.md')
    .map(name => join(rootPath, name));
}

/** Applies defaults to a metadata object */
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
    category: 'Components',
    layout: BaLayoutType.Default,
    order: baristaMetadata.order,
    navGroup: baristaMetadata.navGroup,
  };

  return metadataWithDefaults;
}

/**
 * Get all paths of directors that contain a README.md and
 * a barista.json metadata file recursively.
 */
function getBaristaContentDirectoryPaths(path: string): string[] {
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
      fileList.push(...getBaristaContentDirectoryPaths(filePath));
    }
  }

  return fileList;
}

/** Page-builder for angular component & documentation pages. */
export const componentsBuilder: BaPageBuilder = async (
  globalTransformers: BaPageTransformer[],
  componentsPaths?: string[],
) => {
  let readmeDirs: string[] = [];

  if (componentsPaths) {
    for (const path of componentsPaths) {
      readmeDirs.push(...getBaristaContentDirectoryPaths(path));
    }
  } else {
    readmeDirs = getBaristaContentDirectoryPaths(LIB_ROOT);
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
      readFileSync(join(dir, 'barista.json'), { encoding: 'utf-8' }),
    );
    // Filter draft pages
    if (!baristaMetadata.draft) {
      const pageContent = await transformPage(
        {
          ...setMetadataDefaults(baristaMetadata),
          content: readFileSync(join(dir, 'README.md'), { encoding: 'utf-8' }),
        },
        [...TRANSFORMERS, ...globalTransformers],
      );
      transformed.push({ pageContent, relativeOutFile });
    }
  }

  // Handle component documentation files
  for (const filepath of documentationMdFiles) {
    const fileBasename = basename(filepath, '.md').toLowerCase();
    const fileDir = dirname(filepath);

    const baristaMetadata = existsSync(join(fileDir, `${fileBasename}.json`))
      ? JSON.parse(
          readFileSync(join(fileDir, `${fileBasename}.json`), {
            encoding: 'utf-8',
          }),
        )
      : undefined;

    // Filter pages without metadata or set to draft
    if (baristaMetadata && !baristaMetadata.draft) {
      const relativeOutFile = join(
        'components',
        `${slugify(baristaMetadata.title || fileBasename)}.json`,
      );
      const pageContent = await transformPage(
        {
          ...setMetadataDefaults(baristaMetadata),
          navGroup: 'docs',
          content: readFileSync(filepath, { encoding: 'utf-8' }),
        },
        [...TRANSFORMERS, ...globalTransformers],
      );
      transformed.push({ pageContent, relativeOutFile });
    }
  }

  return transformed;
};

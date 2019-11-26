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

import { html, load as loadWithCheerio } from 'cheerio';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { basename, extname, join } from 'path';

import {
  BaIconPageContent,
  BaLayoutType,
  BaPageBuilder,
  BaPageBuildResult,
  BaPageTransformer,
} from '@dynatrace/barista-components/barista-definitions';
import { BaIconMetadata, BaIconsChangelog } from '../types';

import {
  extractH1ToTitleTransformer,
  markdownToHtmlTransformer,
  transformPage,
} from '../transform';
import { convertJsonChangelogToMarkdown } from '../utils/convert-json-changelog-to-markdown';

const TRANSFORMERS: BaPageTransformer[] = [
  markdownToHtmlTransformer,
  extractH1ToTitleTransformer,
];

const PUBLIC_BUILD = process.env.PUBLIC_BUILD === 'true';
const ICONS_ROOT =
  process.env.ICONS_ROOT || join(__dirname, '../../../../barista-icons/src');
const CHANGELOG_SRC = join(
  ICONS_ROOT,
  '../_build/barista-icons/_templates',
  `CHANGELOG${PUBLIC_BUILD ? '-public' : ''}.json`,
);

/**
 * Map mode entry of changelog template to action description for the changelog to be displayed.
 */
const CHANGELOG_ACTION_MAP = {
  ADD: 'Added in version',
  MODIFY: 'Modified in version',
  MOVE: 'Renamed in version',
  PUBLISHED: 'Published in version',
  UNPUBLISHED: 'Unpublished in version',
};

function getIconFilesByPath(rootPath: string): string[] {
  return readdirSync(rootPath)
    .filter(name => extname(name) === '.svg')
    .map(name => join(rootPath, name));
}

/**
 * Get the changelog template containing all changes for each icon sorted by iconpack version.
 */
function getChangelogTemplate(): BaIconsChangelog {
  const changelogContent = readFileSync(CHANGELOG_SRC).toString();
  return JSON.parse(changelogContent);
}

/**
 * Genrates the iconpack changelog and returns a page builder result.
 */
async function generateIconPackChangelog(
  changelogTemplate: BaIconsChangelog,
): Promise<BaPageBuildResult> {
  const iconPackChangelog = convertJsonChangelogToMarkdown(changelogTemplate);
  const pageContent = await transformPage(
    {
      title: 'Iconpack changelog',
      description:
        'The iconpack changelog lists all changes of the @dynatrace/dt-iconpack package.',
      nav_group: 'docs',
      toc: true,
      content: iconPackChangelog,
      layout: BaLayoutType.Default,
    },
    TRANSFORMERS,
  );
  return {
    relativeOutFile: join('components/iconpack-changelog.json'),
    pageContent,
  };
}

/**
 * Get the changelog entries for one specific icon.
 */
function getIconChangelog(
  changelogTemplate: BaIconsChangelog,
  iconName: string,
): string[] {
  const iconChangelog: string[] = [];
  Object.keys(changelogTemplate).forEach(key => {
    changelogTemplate[key].forEach(entry => {
      if (entry.name === iconName) {
        iconChangelog.push(`${CHANGELOG_ACTION_MAP[entry.mode]} ${key}`);
      }
    });
  });
  return iconChangelog;
}

/**
 * Get only the <svg> part of the file and remove fill attributes.
 */
function getSvgWithoutFill(filePath: string): string {
  const iconSvg = readFileSync(filePath).toString();
  const cheerioIcon = loadWithCheerio(iconSvg);
  const svg = cheerioIcon('svg');
  svg.removeAttr('fill');
  svg.children().removeAttr('fill');
  return html(svg) || '';
}

export const iconsBuilder: BaPageBuilder = async () => {
  if (!existsSync(ICONS_ROOT)) {
    return [];
  }

  const changelogTemplate = getChangelogTemplate();
  const iconFilePaths = getIconFilesByPath(ICONS_ROOT);
  const transformed: BaPageBuildResult[] = [];

  for (const filePath of iconFilePaths) {
    const iconName = basename(filePath, '.svg');
    const metadata: BaIconMetadata = JSON.parse(
      readFileSync(join(ICONS_ROOT, `${iconName}.json`)).toString(),
    );

    // Skip non-public icons on public build.
    if (PUBLIC_BUILD && metadata.public === false) {
      console.log(`Public build. Skip non-public icon ${filePath}.`);
      continue;
    }

    const relativeOutFile = join('resources/icons/', `${iconName}.json`);
    const pageContent: BaIconPageContent = {
      title: metadata.title,
      layout: BaLayoutType.Icon,
      iconname: iconName,
      iconSvg: getSvgWithoutFill(filePath),
      changelog: getIconChangelog(changelogTemplate, iconName),
      tags: metadata.tags,
    };

    transformed.push({ pageContent, relativeOutFile });
  }

  // Generate and add the iconpack changelog page for the component-section of Barista.
  transformed.push(await generateIconPackChangelog(changelogTemplate));

  return transformed;
};

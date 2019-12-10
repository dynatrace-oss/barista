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
  BaLayoutType,
  BaPageBuilder,
  BaPageBuildResult,
  BaPageTransformer,
  BaSinglePageContent,
  BaIconOverviewItem,
} from '@dynatrace/barista-components/barista-definitions';
import { BaIconMetadata, BaIconsChangelog } from '../types';

import {
  extractH1ToTitleTransformer,
  markdownToHtmlTransformer,
  transformPage,
} from '../transform';
import { convertJsonChangelogToMarkdown } from '../utils/convert-json-changelog-to-markdown';
import { isPublicBuild } from '../utils/isPublicBuild';

const TRANSFORMERS: BaPageTransformer[] = [
  markdownToHtmlTransformer,
  extractH1ToTitleTransformer,
];

const ICONS_ROOT =
  process.env.ICONS_ROOT || join(__dirname, '../../../../barista-icons/src');
const CHANGELOG_SRC = join(
  ICONS_ROOT,
  '../_build/barista-icons/_templates',
  `CHANGELOG${isPublicBuild() ? '-public' : ''}.json`,
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
 * Generates the iconpack changelog and returns a page builder result.
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
      navGroup: 'docs',
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
function getIconChangelogHtml(
  changelogTemplate: BaIconsChangelog,
  iconName: string,
): string {
  const iconChangelog: string[] = [];
  for (const key of Object.keys(changelogTemplate)) {
    for (const entry of changelogTemplate[key]) {
      if (entry.name === iconName) {
        iconChangelog.push(
          `<li>${CHANGELOG_ACTION_MAP[entry.mode]} ${key}</li>`,
        );
      }
    }
  }
  return iconChangelog.length ? `<ul>${iconChangelog.join('\n')}</ul>` : '';
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
  const iconOverviewData: BaIconOverviewItem[] = [];

  for (const filePath of iconFilePaths) {
    const iconName = basename(filePath, '.svg');
    const metadata: BaIconMetadata = JSON.parse(
      readFileSync(join(ICONS_ROOT, `${iconName}.json`)).toString(),
    );

    // Skip non-public icons on public build.
    if (isPublicBuild() && metadata.public === false) {
      continue;
    }
    let svg = getSvgWithoutFill(filePath);
    // Escape "-chars so it fits into an html attribute
    svg = svg.replace(/"/g, '"');

    // Make svg single line
    svg = svg.replace(/\n|\r/g, '');

    const content = `
${getIconChangelogHtml(changelogTemplate, iconName)}

<ba-icon-color-wheel name='${iconName}' svg='${svg}'></ba-icon-color-wheel>
`;

    const relativeOutFile = join('resources/icons/', `${iconName}.json`);
    const pageContent: BaSinglePageContent = {
      title: metadata.title,
      layout: BaLayoutType.Icon,
      tags: metadata.tags,
      toc: false,
      content,
    };

    transformed.push({ pageContent, relativeOutFile });
    iconOverviewData.push({
      title: metadata.title,
      name: iconName,
      tags: metadata.tags,
    });
  }

  // Generate and add the iconpack changelog page for the component-section of Barista.
  transformed.push(await generateIconPackChangelog(changelogTemplate));

  // Generate icon overview page
  transformed.push({
    pageContent: {
      title: 'Icons',
      description: 'On this page you find a list of all available icons.',
      layout: BaLayoutType.IconOverview,
      icons: iconOverviewData,
      category: 'Resources',
    },
    relativeOutFile: 'resources/icons.json',
  });

  return transformed;
};

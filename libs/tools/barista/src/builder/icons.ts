/**
 * @license
 * Copyright 2021 Dynatrace LLC
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
import { existsSync, readdirSync, readFileSync } from 'fs';
import { basename, extname, join } from 'path';

import {
  BaSinglePageContent,
  BaPageLayoutType,
  BaIcon,
} from '@dynatrace/shared/design-system/interfaces';
import { isPublicBuild } from '@dynatrace/shared/node';
import { environment } from '@environments/barista-environment';

import {
  BaPageBuilder,
  BaPageBuildResult,
  BaPageTransformer,
  BaIconsChangelog,
} from '../types';

import {
  extractH1ToTitleTransformer,
  markdownToHtmlTransformer,
  transformPage,
  headingIdTransformer,
  relativeUrlTransformer,
} from '../transform';
import { convertJsonChangelogToMarkdown } from '../utils/convert-json-changelog-to-markdown';

const TRANSFORMERS: BaPageTransformer[] = [
  markdownToHtmlTransformer,
  extractH1ToTitleTransformer,
  headingIdTransformer,
  relativeUrlTransformer,
];

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
    .filter((name) => extname(name) === '.svg')
    .map((name) => join(rootPath, name));
}

/**
 * Get the changelog template containing all changes for each icon sorted by iconpack version.
 */
function getChangelogTemplate(): BaIconsChangelog {
  if (!existsSync(environment.iconsChangelogFileName)) {
    return {};
  }
  const changelogContent = readFileSync(environment.iconsChangelogFileName, {
    encoding: 'utf-8',
  });
  return JSON.parse(changelogContent) as BaIconsChangelog;
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
      layout: BaPageLayoutType.Default,
    },
    TRANSFORMERS,
  );
  return {
    relativeOutFile: join('components', 'iconpack-changelog.json'),
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
  const iconSvg = readFileSync(filePath, { encoding: 'utf-8' });
  const cheerioIcon = loadWithCheerio(iconSvg);
  const svg = cheerioIcon('svg');
  svg.removeAttr('fill');
  svg.find('[fill]').removeAttr('fill');
  return svg.parent().html() || '';
}

export const iconsBuilder: BaPageBuilder = async () => {
  if (!existsSync(environment.iconsRoot)) {
    return [];
  }

  const changelogTemplate = getChangelogTemplate();
  const iconFilePaths = getIconFilesByPath(environment.iconsRoot);
  const transformed: BaPageBuildResult[] = [];
  const iconOverviewData: BaIcon[] = [];

  for (const filePath of iconFilePaths) {
    const iconName = basename(filePath, '.svg');
    const metadataPath = join(environment.iconsRoot, `${iconName}.json`);

    // Skip icons without metadata
    if (!existsSync(metadataPath)) {
      console.log(`No metadata available for icon ${iconName}.`);
      continue;
    }

    const iconData: BaIcon = {
      ...(JSON.parse(
        readFileSync(metadataPath, { encoding: 'utf-8' }),
      ) as BaIcon),
      name: iconName,
    };

    // Skip non-public icons on public build.
    if (isPublicBuild() && iconData.public === false) {
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
      title: iconData.title,
      layout: BaPageLayoutType.Icon,
      tags: iconData.tags,
      toc: false,
      content,
    };

    transformed.push({ pageContent, relativeOutFile });
    iconOverviewData.push(iconData);
  }

  // Generate and add the iconpack changelog page for the component-section of Barista.
  transformed.push(await generateIconPackChangelog(changelogTemplate));

  // Generate icon overview page
  transformed.push({
    pageContent: {
      title: 'Icons',
      description: 'On this page you find a list of all available icons.',
      layout: BaPageLayoutType.IconOverview,
      icons: iconOverviewData,
      category: 'Resources',
    },
    relativeOutFile: 'resources/icons.json',
  });

  return transformed;
};

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

import { existsSync, readdirSync, readFileSync } from 'fs';
import { basename, extname, join } from 'path';

import {
  BaPageBuilder,
  BaPageBuildResult,
  BaLayoutType,
} from '@dynatrace/barista-components/barista-definitions';

const PUBLIC_BUILD = process.env.PUBLIC_BUILD === 'true';
const ICONS_ROOT =
  process.env.ICONS_ROOT || join(__dirname, '../../../../barista-icons/src');

function getIconFilesByPath(rootPath: string): string[] {
  return readdirSync(rootPath)
    .filter(name => extname(name) === '.svg')
    .map(name => join(rootPath, name));
}

export const iconsBuilder: BaPageBuilder = async () => {
  if (!existsSync(ICONS_ROOT)) {
    return [];
  }

  const iconFilePaths = getIconFilesByPath(ICONS_ROOT);

  const transformed: BaPageBuildResult[] = [];

  for (const filePath of iconFilePaths) {
    const iconName = basename(filePath, '.svg');
    const metadata = JSON.parse(
      readFileSync(join(ICONS_ROOT, `${iconName}.json`)).toString(),
    );

    // Skip non-public icons on public build.
    if (PUBLIC_BUILD && metadata.public === false) {
      console.log(`Public build. Skip non-public icon ${filePath}.`);
      continue;
    }

    const relativeOutFile = join('resources/icons/', `${iconName}.json`);
    const pageContent = {
      title: metadata.title,
      layout: BaLayoutType.Icon,
      content: `<p>Icon page for ${iconName}</p>`,
    };

    // TODO: define structure for icon page --> barista app

    transformed.push({ pageContent, relativeOutFile });
  }

  return transformed;
};

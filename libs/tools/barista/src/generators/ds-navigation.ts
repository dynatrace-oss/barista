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

import { join, basename } from 'path';
import { promises as fs, readdirSync, lstatSync } from 'fs';

import { DsSideNavContent } from '../types';

function addNavSection(
  sideNav: DsSideNavContent,
  navGroup: string,
): DsSideNavContent {
  const newSideNav = { ...sideNav };
  for (const section of newSideNav.sections) {
    if (section.title && navGroup == section.title) {
      return newSideNav;
    }
  }

  newSideNav.sections.push({ title: navGroup, items: [] });
  return newSideNav;
}

/** Check if given path is a directory within distDir. */
function isDirectory(path: string): boolean {
  try {
    return lstatSync(path).isDirectory();
  } catch {
    return false;
  }
}

/** Builds navigation */
export const navigationBuilder = async (distDir: string) => {
  const allDirectories = readdirSync(distDir).filter((dirPath) =>
    isDirectory(join(distDir, dirPath)),
  );

  for (const directory of allDirectories) {
    const currentPath = join(distDir, directory);
    const files = readdirSync(currentPath);
    const fileMap = new Map<string, any>();

    let sideNav: DsSideNavContent = {
      sections: [],
    };

    for (const file of files) {
      const fileContent = await fs.readFile(join(currentPath, file), {
        encoding: 'utf-8',
      });
      const content = JSON.parse(fileContent) as any;
      // Keep the file in memory to update after the sidenavs have been built.
      fileMap.set(file, content);

      sideNav = addNavSection(sideNav, content.navGroup);

      for (const section of sideNav.sections) {
        const filepath = basename(join(directory, file), '.json');

        if (content.navGroup == section.title) {
          section.items.push({
            title: content.title,
            link: `/${filepath}`,
          });
        }
      }
    }

    for (const file of files) {
      const content = fileMap.get(file);
      // add sidenav to the json file
      content.sidenav = sideNav;
      await fs.writeFile(
        join(currentPath, file),
        JSON.stringify(content, null, 2),
        {
          encoding: 'utf8',
        },
      );
    }
  }
};

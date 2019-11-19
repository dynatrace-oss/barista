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

import { BaOverviewPage, BaSidenavContents } from '../../../apps/barista/src/shared/page-contents';
import { BaPageBuildResult, BaPageBuilder } from './types';
import { componentOverview, componentsBuilder } from './builder/components';
import { dirname, join } from 'path';
import { promises as fs, mkdirSync, readFileSync, readdirSync } from 'fs';

// Add your page-builder to this map to register it.
const BUILDERS = new Map<string, BaPageBuilder>([
  ['components-builder', componentsBuilder],
]);

const DIST_DIR = join(__dirname, '../../', 'apps', 'barista', 'data');

/** Builds pages using all registered builders. */
async function buildPages(): Promise<void[]> {
  const builders = Array.from(BUILDERS.values());
  // Run each builder and collect all build results
  const results = await builders.reduce<Promise<BaPageBuildResult[]>>(
    async (aggregatedResults, currentBuilder) => [
      ...(await aggregatedResults),
      ...(await currentBuilder()),
    ],
    Promise.resolve([]),
  );

  // Make sure dist dir is created
  mkdirSync(DIST_DIR, { recursive: true });

  const files = results.map(async result => {
    const outFile = join(DIST_DIR, result.relativeOutFile);

    // Creating folder path if it does not exist
    mkdirSync(dirname(outFile), { recursive: true });

    // Write file with page content to disc.
    // tslint:disable-next-line: no-magic-numbers
    return fs.writeFile(outFile, JSON.stringify(result.pageContent, null, 2), {
      flag: 'w', // "w" -> Create file if it does not exist
      encoding: 'utf8',
    });
  });

  return Promise.all(files);
}

/** Builds overview pages */
async function buildOverviewPages(): Promise<void[]> {
  const allDirectories = readdirSync(DIST_DIR);

  const pages = allDirectories.map(async directory => {
    if (directory.indexOf('.') < 0 && directory !== 'components') {
      const path = join(DIST_DIR, directory);
      const files = readdirSync(path);
      const capitalizedTitle =
        directory.charAt(0).toUpperCase() + directory.slice(1);
      let overviewPage: BaOverviewPage = {
        title: capitalizedTitle,
        id: directory,
        layout: 'overview',
        sections: [
          {
            items: [],
          },
        ],
      };

      let sidenavData: BaSidenavContents = {
        sections: [
          {
            title: capitalizedTitle,
            items: [],
          }
        ]
      };

      for (const file of files) {
        const link = join(directory, file.replace(/\.[^/.]+$/, ''));
        const content = JSON.parse(readFileSync(join(path, file)).toString());
        overviewPage.sections[0].items.push({
          identifier:
            content.title && content.title.length > 1
              ? content.title[0] + content.title[1]
              : 'Id',
          title: content.title,
          description: content.description,
          category: capitalizedTitle,
          link: link,
          badge: content.properties,
        });

        sidenavData.sections[0].items.push({
          title: content.title,
          link: link,
        });
      }

      for (const file of files) {
        const pathToFile = join(DIST_DIR, directory, file);
        const fileContent = JSON.parse(readFileSync(join(path, file)).toString());
        fileContent.sidenav = sidenavData;

        fs.writeFile(pathToFile, JSON.stringify(fileContent, null, 2), {
          flag: 'w', // "w" -> Create file if it does not exist
          encoding: 'utf8',
        });
      }

      const filepath = join(DIST_DIR, `${directory}.json`);
      // Write file with page content to disc.
      // tslint:disable-next-line: no-magic-numbers
      return fs.writeFile(filepath, JSON.stringify(overviewPage, null, 2), {
        flag: 'w', // "w" -> Create file if it does not exist
        encoding: 'utf8',
      });
    }
  });

  return Promise.all(pages);
}

/** Builds overview pages */
async function buildComponentOverview() {
  const filepath = join(DIST_DIR, 'components.json');
  fs.writeFile(filepath, JSON.stringify(componentOverview, null, 2), {
    flag: 'w', // "w" -> Create file if it does not exist
    encoding: 'utf8',
  });

  let directoryPath = join(DIST_DIR, 'components');
  const files = readdirSync(directoryPath);

  for (const file of files) {
    const pathToFile = join(DIST_DIR, 'components', file);
    const fileContent = JSON.parse(readFileSync(pathToFile).toString());
    fileContent.sidenav = componentOverview;

    fs.writeFile(pathToFile, JSON.stringify(fileContent, null, 2), {
      flag: 'w', // "w" -> Create file if it does not exist
      encoding: 'utf8',
    });
  }
}

buildPages()
  .then(results => {
    console.log(`${results.length} Pages created.`);
    buildOverviewPages();
    buildComponentOverview();
  })
  .catch(err => {
    console.error(err);
  });

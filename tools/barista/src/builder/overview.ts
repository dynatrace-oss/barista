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

import { join } from 'path';
import { promises as fs, readFileSync, readdirSync, lstatSync } from 'fs';

import {
  BaOverviewPage,
  BaOverviewPageSectionItem,
  BaSinglePageMeta,
} from '@dynatrace/barista-components/barista-definitions';

const DIST_DIR = join(__dirname, '../../', 'apps', 'barista', 'data');

// for now we manually select highlighted items, later this data can maybe be fetched from google analytics
const highlightedItems = [
  'Table',
  'Chart',
  'Button',
  'Filter field',
  'Card',
  'Icon',
  'Changelog',
  'Get started',
  'Colors',
  'Icons',
  'Common UI styles',
  'Theming',
];

function getOverviewSectionItem(
  filecontent: BaSinglePageMeta,
  section: string,
  filepath: string,
): BaOverviewPageSectionItem {
  let properties =
    filecontent.properties && filecontent.properties.length > 0
      ? [...filecontent.properties]
      : [];
  if (highlightedItems.includes(filecontent.title)) {
    properties.push('favorite');
  }

  return {
    title: filecontent.title,
    identifier:
      filecontent.title && filecontent.title.length > 1
        ? filecontent.title[0] + filecontent.title[1]
        : 'Id',
    description: filecontent.description || '',
    section: section,
    link: filepath,
    badge: properties,
    order: filecontent.order,
  };
}

/** Check if given path is a directory within DIST_DIR. */
function isDirectory(path: string): boolean {
  try {
    return lstatSync(join(DIST_DIR, path)).isDirectory();
  } catch {
    return false;
  }
}

/** Builds overview pages */
export const overviewBuilder = async () => {
  const allDirectories = readdirSync(DIST_DIR).filter(dirPath =>
    isDirectory(dirPath),
  );

  const pages = allDirectories.map(async directory => {
    const path = join(DIST_DIR, directory);

    if (directory !== 'components') {
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

      for (const file of files) {
        if (file.indexOf('.') > 0) {
          const filepath = join(directory, file.replace(/\.[^/.]+$/, ''));
          const content = JSON.parse(readFileSync(join(path, file)).toString());
          overviewPage.sections[0].items.push(
            getOverviewSectionItem(content, capitalizedTitle, filepath),
          );
        }
      }

      const overviewfilepath = join(DIST_DIR, `${directory}.json`);
      // Write file with page content to disc.
      // tslint:disable-next-line: no-magic-numbers
      return fs.writeFile(
        overviewfilepath,
        JSON.stringify(overviewPage, null, 2),
        {
          flag: 'w', // "w" -> Create file if it does not exist
          encoding: 'utf8',
        },
      );
    } else if (directory === 'components') {
      const files = readdirSync(path);

      let componentOverview: BaOverviewPage = {
        title: 'Components',
        id: 'components',
        layout: 'overview',
        description:
          'Read all about development with/of our Angular components in how to get started. If you run into any troubles or want to contribute, please visit our GitHub page.',
        sections: [
          {
            title: 'Documentation',
            items: [],
          },
          {
            title: 'Components',
            items: [],
          },
          {
            title: 'Angular resources',
            items: [],
          },
        ],
      };

      for (const file of files) {
        const content = JSON.parse(readFileSync(join(path, file)).toString());
        for (const section of componentOverview.sections) {
          const filepath = join(directory, file.replace(/\.[^/.]+$/, ''));
          if (
            content.navGroup === 'docs' &&
            section.title === 'Documentation'
          ) {
            section.items.push(
              getOverviewSectionItem(content, section.title, filepath),
            );
          } else if (
            content.navGroup === 'other' &&
            section.title === 'Angular resources'
          ) {
            section.items.push(
              getOverviewSectionItem(content, 'Angular resource', filepath),
            );
          } else if (section.title === 'Components' && !content.navGroup) {
            section.items.push(
              getOverviewSectionItem(content, 'Component', filepath),
            );
          }
        }
      }

      for (const section of componentOverview.sections) {
        if (section.title === 'Documentation') {
          const sectionItems = section.items;
          sectionItems.sort(function(
            a: BaOverviewPageSectionItem,
            b: BaOverviewPageSectionItem,
          ): number {
            if (a.order && b.order) {
              return a.order - b.order;
            }

            if (b.order) {
              return 1;
            }

            return -1;
          });
          section.items = sectionItems;
        }
      }

      const overviewfilepath = join(DIST_DIR, `${directory}.json`);
      // Write file with page content to disc.
      // tslint:disable-next-line: no-magic-numbers
      return fs.writeFile(
        overviewfilepath,
        JSON.stringify(componentOverview, null, 2),
        {
          flag: 'w', // "w" -> Create file if it does not exist
          encoding: 'utf8',
        },
      );
    }
  });
  return Promise.all(pages);
};

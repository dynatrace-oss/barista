import { BaPageBuildResult, BaPageBuilder } from './types';
import { dirname, join } from 'path';
import { promises as fs, mkdirSync, readFileSync, readdirSync } from 'fs';

import { BaOverviewPage } from '../../../apps/barista/src/shared/page-contents';
import { componentsBuilder } from './builder/components';

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

      for (const file of files) {
        const content = JSON.parse(readFileSync(join(path, file)).toString());
        overviewPage.sections[0].items.push({
          identifier:
            content.title && content.title.length > 1
              ? content.title[0] + content.title[1]
              : 'Id',
          title: content.title,
          description: content.description,
          category: capitalizedTitle,
          link: join(directory, file.replace(/\.[^/.]+$/, '')),
          badge: content.properties,
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

buildPages()
  .then(results => {
    console.log(`${results.length} Pages created.`);
    buildOverviewPages();
  })
  .catch(err => {
    console.error(err);
  });

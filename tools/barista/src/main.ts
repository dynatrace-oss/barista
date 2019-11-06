import { promises as fs, mkdirSync } from 'fs';
import { dirname, join } from 'path';

import { componentsBuilder } from './builder/components';
import { BaPageBuildResult, BaPageBuilder } from './types';

// Add your page-builder to this map to register it.
const BUILDERS = new Map<string, BaPageBuilder>([
  ['components-builder', componentsBuilder],
]);

const DIST_DIR = join(__dirname, '../../', 'barista', 'data');

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

buildPages()
  .then(results => {
    console.log(`${results.length} Pages created.`);
  })
  .catch(err => {
    console.error(err);
  });

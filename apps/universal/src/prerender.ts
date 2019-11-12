import { join } from 'path';

// tslint:disable-next-line:no-import-side-effect
import 'reflect-metadata';
// tslint:disable-next-line:no-import-side-effect
import 'zone.js';

import { renderModuleFactory } from '@angular/platform-server';
import { readFileSync, writeFileSync } from 'fs-extra';
import { log } from 'gulp-util';

import { KitchenSinkServerModuleNgFactory } from './kitchen-sink/kitchen-sink.ngfactory';

const result = renderModuleFactory(KitchenSinkServerModuleNgFactory, {
  document: readFileSync(join(__dirname, 'index.html'), 'utf-8'),
});

result
  .then(content => {
    const filename = join(__dirname, 'index-prerendered.html');

    log(`Outputting result to ${filename}`);
    writeFileSync(filename, content, 'utf-8');
    log('Prerender done.');
  })
  // If rendering the module factory fails, exit the process with an error code because otherwise
  // the CI task will not recognize the failure and will show as "success". The error message
  // will be printed automatically by the `renderModuleFactory` method.
  .catch(() => process.exit(1));

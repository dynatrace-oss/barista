import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DocsModule } from './docs.module';

platformBrowserDynamic()
  .bootstrapModule(DocsModule, { preserveWhitespaces: true })
  // tslint:disable-next-line:no-console typedef
  .catch((err): void => { console.log(err); });

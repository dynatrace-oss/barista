import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule, { preserveWhitespaces: true })
  // tslint:disable-next-line:no-console typedef
  .catch((err): void => { console.log(err); });

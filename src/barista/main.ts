import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule, { preserveWhitespaces: true })
  .catch(
    // tslint:disable-next-line:typedef
    (err): void => {
      console.log(err); // tslint:disable-line:no-console
    },
  );

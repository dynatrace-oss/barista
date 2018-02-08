import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AngularComponentsModule } from "./angular-components.module";

platformBrowserDynamic()
  .bootstrapModule(AngularComponentsModule)
  // tslint:disable-next-line:no-console typedef
  .catch((err): void => { console.log(err); });

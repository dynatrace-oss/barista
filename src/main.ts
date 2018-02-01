import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { UiComponentsModule } from "./ui-components.module";

platformBrowserDynamic()
  .bootstrapModule(UiComponentsModule)
  // tslint:disable-next-line:no-console typedef
  .catch((err): void => { console.log(err); });

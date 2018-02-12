import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { WidgetsDocsModule } from "./widgets-docs.module";

platformBrowserDynamic()
  .bootstrapModule(WidgetsDocsModule)
  // tslint:disable-next-line:no-console typedef
  .catch((err): void => { console.log(err); });

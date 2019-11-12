import { ModuleWithProviders, NgModule } from '@angular/core';

import { DtIcon } from './icon';
import { DT_ICON_CONFIGURATION, DtIconConfiguration } from './icon-config';

@NgModule({
  exports: [DtIcon],
  declarations: [DtIcon],
})
export class DtIconModule {
  /** Returns an icon module to be applied just in the root context. */
  static forRoot(config: DtIconConfiguration): ModuleWithProviders {
    return {
      ngModule: DtIconModule,
      providers: [{ provide: DT_ICON_CONFIGURATION, useValue: config }],
    };
  }
}

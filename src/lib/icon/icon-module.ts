import { NgModule, ModuleWithProviders } from '@angular/core';
import { DT_ICON_CONFIGURATION, DtIconConfiguration } from './icon-config';
import { DtIconRegistry } from './icon-registry';
import { DtIcon } from './icon';

@NgModule({
  exports: [DtIcon],
  declarations: [DtIcon],
  providers: [DtIconRegistry],
})
export class DtIconModule {
  static forRoot(config: DtIconConfiguration): ModuleWithProviders {
    return {
      ngModule: DtIconModule,
      providers: [
        { provide: DT_ICON_CONFIGURATION, useValue: config },
        DtIconRegistry,
      ],
    };
  }
}

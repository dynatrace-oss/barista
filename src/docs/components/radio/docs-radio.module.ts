import { NgModule } from '@angular/core';
import { DefaultRadioExample } from './examples/default-radio-example';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtRadioModule, DtThemingModule } from '@dynatrace/angular-components';
import { NameGroupingRadioExample } from './examples/name-grouping-radio-example';
import { DarkRadioExample } from './examples/dark-radio-example';

export const EXAMPLES = [
  DefaultRadioExample,
  NameGroupingRadioExample,
  DarkRadioExample,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtRadioModule,
    DtThemingModule,
  ],
  declarations: [
    ...EXAMPLES,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
  providers: [
    { provide: COMPONENT_EXAMPLES, useValue: EXAMPLES, multi: true },
  ],
})
export class DocsRadioModule {
}

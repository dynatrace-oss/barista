import { NgModule } from '@angular/core';
import { DefaultRadioExample } from './examples/default-radio-example';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtRadioModule, DtThemingModule } from '@dynatrace/angular-components';
import { NameGroupingRadioExample } from './examples/name-grouping-radio-example';
import { DarkRadioExample } from './examples/dark-radio-example';

const EXAMPLES = [
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
})
export class DocsRadioModule {
}

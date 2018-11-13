import { NgModule } from '@angular/core';
import { COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { DefaultFilterFieldExample } from './examples/filter-field-default-example';
import { DtFilterFieldModule } from '@dynatrace/angular-components';
import { CommonModule } from '@angular/common';

export const EXAMPLES = [
  DefaultFilterFieldExample,
];

@NgModule({
  imports: [
    CommonModule,
    DtFilterFieldModule,
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
export class DocsFilterFieldModule {
}

import { NgModule } from '@angular/core';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import {
  DtSelectionAreaModule,
} from '@dynatrace/angular-components';
import { SelectionAreaDefaultExample } from './examples/selection-area-default-example.component';
import { CommonModule } from '@angular/common';

export const EXAMPLES = [
  SelectionAreaDefaultExample,
];

@NgModule({
  imports: [
    UiModule,
    DtSelectionAreaModule,
    CommonModule,
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
export class DocsSelectionAreaModule {
}

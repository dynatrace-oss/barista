import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import {
  DtSelectionAreaModule, DtChartModule, DtButtonModule,
} from '@dynatrace/angular-components';
import { SelectionAreaDefaultExample } from './examples/selection-area-default-example.component';
import { SelectionAreaChartExample } from './examples/selection-area-chart-example.component';

export const EXAMPLES = [
  SelectionAreaDefaultExample,
  SelectionAreaChartExample,
];

@NgModule({
  imports: [
    UiModule,
    DtSelectionAreaModule,
    DtChartModule,
    DtButtonModule,
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

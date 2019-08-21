import { NgModule } from '@angular/core';

import { DtOverlayModule } from '@dynatrace/angular-components/overlay';

import { DtLegend } from './legend';
import { DtLegendItem, DtLegendOverlay, DtLegendSymbol } from './legend-item';

const DT_LEGEND_DIRECTIVES = [
  DtLegend,
  DtLegendItem,
  DtLegendSymbol,
  DtLegendOverlay,
];

@NgModule({
  exports: DT_LEGEND_DIRECTIVES,
  imports: [DtOverlayModule],
  declarations: DT_LEGEND_DIRECTIVES,
})
export class DtLegendModule {}

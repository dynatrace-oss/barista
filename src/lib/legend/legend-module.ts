import { NgModule } from '@angular/core';
import { DtLegend } from './legend';
import { DtLegendItem, DtLegendSymbol } from './legend-item';

@NgModule({
  exports: [DtLegend, DtLegendItem, DtLegendSymbol],
  declarations: [DtLegend, DtLegendItem, DtLegendSymbol],
})
export class DtLegendModule {}

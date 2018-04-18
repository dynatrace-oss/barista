import { NgModule } from '@angular/core';
import { DtChart } from './chart';
import { CommonModule } from '@angular/common';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';

@NgModule({
  imports: [
    CommonModule,
    DtLoadingDistractorModule,
  ],
  exports: [
    DtChart,
  ],
  declarations: [
    DtChart,
  ],
})
export class DtChartModule { }

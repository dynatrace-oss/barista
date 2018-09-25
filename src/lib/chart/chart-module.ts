import { NgModule } from '@angular/core';
import { DtChart } from './chart';
import { CommonModule } from '@angular/common';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';
import { DtMicroChart } from './microchart/micro-chart';

@NgModule({
  imports: [
    CommonModule,
    DtLoadingDistractorModule,
  ],
  exports: [
    DtChart,
    DtMicroChart,
  ],
  declarations: [
    DtChart,
    DtMicroChart,
  ],
})
export class DtChartModule { }

import { NgModule } from '@angular/core';
import { DtChart } from './chart';
import { CommonModule } from '@angular/common';
import { DtLoadingDistractorModule } from '../loading-distractor/index';

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

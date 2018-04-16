import { NgModule } from '@angular/core';
import { DtChart } from './chart';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DtChart,
  ],
  declarations: [
    DtChart,
  ],
})
export class DtChartModule {}

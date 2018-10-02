import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtMicroChart } from './micro-chart';
import { DtChartModule } from '@dynatrace/angular-components';

@NgModule({
  imports: [
    CommonModule,
    DtChartModule,
  ],
  exports: [
    DtMicroChart,
  ],
  declarations: [
    DtMicroChart,
  ],
})
export class DtMicroChartModule { }

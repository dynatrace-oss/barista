import { NgModule } from '@angular/core';
import { DtChart } from './chart';
import { ModuleWithProviders } from '@angular/compiler/src/core';

@NgModule({
  exports: [
    DtChart,
  ],
  declarations: [
    DtChart,
  ],
})
export class ChartModule {}

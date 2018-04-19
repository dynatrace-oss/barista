import { NgModule } from '@angular/core';

import { DtChartModule } from './chart/chart-module';
import { DtButtonModule } from './button/button-module';
import { DtThemingModule } from './theming/theming-module';
import { DtLoadingDistractorModule } from './loading-distractor/loading-distractor-module';

@NgModule({
  exports: [
    DtChartModule,
    DtButtonModule,
    DtThemingModule,
    DtLoadingDistractorModule,
  ],
})
export class DtAngularComponentsModule { }

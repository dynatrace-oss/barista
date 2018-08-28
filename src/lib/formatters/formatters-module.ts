import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DtCount } from './count/count';
import { DtPercent } from './percent/percent';
import { DtRate } from './rate/rate';

@NgModule({
  declarations: [
    DtCount,
    DtPercent,
    DtRate,
  ],
  exports: [
    DtCount,
    DtPercent,
    DtRate,
  ],
  imports: [
    CommonModule,
  ],
})
export class DtFormattersModule {
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DtCount } from './count/count';
import { DtPercent } from './percent/percent';
import { DtRate } from './rate/rate';
import { DtRateFormatter } from './rate/rate-formatter';

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
  providers: [
    DtRateFormatter,
  ],
})
export class DtFormattersModule {
}

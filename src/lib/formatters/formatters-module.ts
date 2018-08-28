import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DtCount } from './count/count';
import { DtPercent } from './percent/percent';
import { DtRate } from './rate/rate';
import { DtBytes } from './bytes/bytes';

@NgModule({
  declarations: [
    DtBytes,
    DtCount,
    DtPercent,
    DtRate,
  ],
  exports: [
    DtBytes,
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

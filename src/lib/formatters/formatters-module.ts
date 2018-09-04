import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DtCount } from './count/count';
import { DtPercent } from './percent/percent';
import { DtRate } from './rate/rate';
import { DtBytes } from './bytes/bytes';
import { DtKilobytes } from './bytes/kilobytes';
import { DtMegabytes } from './bytes/megabytes';
import { DtBits } from './bits/bits';

@NgModule({
  declarations: [
    DtBytes,
    DtBits,
    DtKilobytes,
    DtMegabytes,
    DtCount,
    DtPercent,
    DtRate,
  ],
  exports: [
    DtBytes,
    DtBits,
    DtKilobytes,
    DtMegabytes,
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

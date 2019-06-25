import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DtCount } from './count/count';
import { DtPercent } from './percent/percent';
import { DtRate } from './rate/rate';
import { DtBytes } from './bytes/bytes';
import { DtKilobytes } from './bytes/kilobytes';
import { DtMegabytes } from './bytes/megabytes';
import { DtBits } from './bits/bits';
import { DtDateRange } from './date/date-range';

const FORMATTERS = [
  DtBytes,
  DtBits,
  DtKilobytes,
  DtMegabytes,
  DtCount,
  DtPercent,
  DtRate,
  DtDateRange,
];

@NgModule({
  declarations: FORMATTERS,
  exports: FORMATTERS,
  imports: [CommonModule],
})
export class DtFormattersModule {}

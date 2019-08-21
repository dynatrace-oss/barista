import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtBits } from './bits/bits';
import { DtBytes } from './bytes/bytes';
import { DtKilobytes } from './bytes/kilobytes';
import { DtMegabytes } from './bytes/megabytes';
import { DtCount } from './count/count';
import { DtDateRange } from './date/date-range';
import { DtPercent } from './percent/percent';
import { DtRate } from './rate/rate';

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

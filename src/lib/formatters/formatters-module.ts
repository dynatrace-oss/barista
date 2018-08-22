import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormatterUtil } from './formatter-util';
import { DtCount } from './count/count';
import { DtPercent } from './percent/percent';

@NgModule({
  declarations: [
    DtCount,
    DtPercent,
  ],
  exports: [
    DtCount,
    DtPercent,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    FormatterUtil,
  ],
})
export class DtFormattersModule {
}

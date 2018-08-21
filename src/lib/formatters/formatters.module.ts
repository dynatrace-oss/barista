import { CountPipe } from '@dynatrace/angular-components/formatters/count/count.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormatterUtil } from '@dynatrace/angular-components/formatters/formatter-util';
import { PercentPipe } from '@dynatrace/angular-components/formatters/percent/percent.pipe';

@NgModule({
  declarations: [
    CountPipe,
    PercentPipe,
  ],
  exports: [
    CountPipe,
    PercentPipe,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    FormatterUtil,
  ],
})
export class FormattersModule {
}

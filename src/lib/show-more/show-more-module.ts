import { NgModule } from '@angular/core';
import { DtShowMore, DtShowLessLabel } from './show-more';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { CommonModule } from '@angular/common';

// tslint:disable:deprecation
@NgModule({
  imports: [CommonModule, DtIconModule],
  exports: [DtShowMore, DtShowLessLabel, DtIconModule],
  declarations: [DtShowMore, DtShowLessLabel],
})
export class DtShowMoreModule {}
// tslint:enable:deprecation

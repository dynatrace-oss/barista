import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtIconModule } from '@dynatrace/angular-components/icon';

import { DtShowLessLabel, DtShowMore } from './show-more';

// tslint:disable:deprecation
@NgModule({
  imports: [CommonModule, DtIconModule],
  exports: [DtShowMore, DtShowLessLabel, DtIconModule],
  declarations: [DtShowMore, DtShowLessLabel],
})
export class DtShowMoreModule {}
// tslint:enable:deprecation

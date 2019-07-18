import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtShowMore } from './show-more';

// tslint:disable:deprecation
@NgModule({
  imports: [CommonModule, DtIconModule],
  exports: [DtShowMore, DtIconModule],
  declarations: [DtShowMore],
})
export class DtShowMoreModule {}
// tslint:enable:deprecation

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtIconModule } from '@dynatrace/angular-components/icon';

import { DtAlert } from './alert';

@NgModule({
  imports: [CommonModule, DtIconModule],
  exports: [DtAlert],
  declarations: [DtAlert],
})
export class DtAlertModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtIconModule } from '@dynatrace/angular-components/icon';

import { DtTag, DtTagKey } from './tag';

@NgModule({
  imports: [CommonModule, DtIconModule, DtButtonModule],
  exports: [DtTag, DtTagKey],
  declarations: [DtTag, DtTagKey],
})
export class DtTagModule {}

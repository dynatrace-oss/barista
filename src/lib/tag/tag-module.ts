import { NgModule } from '@angular/core';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtTag, DtTagKey } from './tag';
import { CommonModule } from '@angular/common';
import { DtIconModule } from '@dynatrace/angular-components/icon';

@NgModule({
  imports: [CommonModule, DtIconModule, DtButtonModule],
  exports: [DtTag, DtTagKey],
  declarations: [DtTag, DtTagKey],
})
export class DtTagModule {}

import {NgModule} from '@angular/core';
import {DtTag, DtTagKey} from './tag';
import {CommonModule} from '@angular/common';
import {DtIconModule} from '../icon/icon-module';

@NgModule({
  imports: [
    CommonModule,
    DtIconModule,
  ],
  exports: [
    DtTag,
    DtTagKey,
    DtIconModule,
  ],
  declarations: [
    DtTag,
    DtTagKey,
  ],
})
export class DtTagModule {}

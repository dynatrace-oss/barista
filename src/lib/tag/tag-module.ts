import {NgModule} from '@angular/core';
import {DtTag, DtTagKey} from './tag';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DtTag,
    DtTagKey,
  ],
  declarations: [
    DtTag,
    DtTagKey,
  ],
})
export class DtTagModule {}

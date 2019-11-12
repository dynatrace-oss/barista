import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtThemingModule } from '@dynatrace/barista-components/theming';

import { DtTag, DtTagKey } from './tag';
import { DtTagAdd } from './tag-add/tag-add';
import { DtTagList } from './tag-list/tag-list';

@NgModule({
  imports: [
    CommonModule,
    DtIconModule,
    DtButtonModule,
    DtInputModule,
    OverlayModule,
    A11yModule,
    DtThemingModule,
  ],
  exports: [DtTag, DtTagKey, DtTagAdd, DtTagList],
  declarations: [DtTag, DtTagKey, DtTagAdd, DtTagList],
})
export class DtTagModule {}

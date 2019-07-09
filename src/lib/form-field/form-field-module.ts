import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformModule } from '@angular/cdk/platform';
import { DtHint } from './hint';
import { DtLabel } from './label';
import { DtError } from './error';
import { DtFormField } from './form-field';
import { DtPrefix } from './prefix';
import { DtSuffix } from './suffix';

@NgModule({
  imports: [CommonModule, PlatformModule],
  exports: [DtFormField, DtLabel, DtHint, DtError, DtPrefix, DtSuffix],
  declarations: [DtFormField, DtLabel, DtHint, DtError, DtPrefix, DtSuffix],
})
export class DtFormFieldModule {}

import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtError } from './error';
import { DtFormField } from './form-field';
import { DtHint } from './hint';
import { DtLabel } from './label';
import { DtPrefix } from './prefix';
import { DtSuffix } from './suffix';

@NgModule({
  imports: [CommonModule, PlatformModule],
  exports: [DtFormField, DtLabel, DtHint, DtError, DtPrefix, DtSuffix],
  declarations: [DtFormField, DtLabel, DtHint, DtError, DtPrefix, DtSuffix],
})
export class DtFormFieldModule {}

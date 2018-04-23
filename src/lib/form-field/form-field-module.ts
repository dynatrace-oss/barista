import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformModule } from '@angular/cdk/platform';
import { DtFormField, DtLabel, DtHint, DtError } from './form-field';

@NgModule({
  imports: [
    CommonModule,
    PlatformModule,
  ],
  exports: [
    DtFormField,
    DtLabel,
    DtHint,
    DtError,
  ],
  declarations: [
    DtFormField,
    DtLabel,
    DtHint,
    DtError,
  ],
})
export class DtFormFieldModule { }

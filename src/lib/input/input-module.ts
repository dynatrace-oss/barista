import { NgModule } from '@angular/core';
import { DtInput } from './input';
import { CommonModule } from '@angular/common';
import { PlatformModule } from '@angular/cdk/platform';
import { DEFAULT_ERROR_STATE_MATCHER_PROVIDER } from '../core/index';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';

@NgModule({
  imports: [
    CommonModule,
    PlatformModule,
  ],
  exports: [
    DtInput,
  ],
  declarations: [
    DtInput,
  ],
  providers: [DEFAULT_ERROR_STATE_MATCHER_PROVIDER],
})
export class DtInputModule { }

import { NgModule } from '@angular/core';
import { DtInput } from './input';
import { CommonModule } from '@angular/common';
import { PlatformModule } from '@angular/cdk/platform';
import { ErrorStateMatcher } from '@dynatrace/angular-components/core';

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
  providers: [ErrorStateMatcher],
})
export class DtInputModule { }

import { NgModule } from '@angular/core';
import { DtInput } from './input';
import { CommonModule } from '@angular/common';
import { PlatformModule } from '@angular/cdk/platform';

@NgModule({
  imports: [CommonModule, PlatformModule],
  exports: [DtInput],
  declarations: [DtInput],
})
export class DtInputModule {}

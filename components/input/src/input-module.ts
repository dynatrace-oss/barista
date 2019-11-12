import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtInput } from './input';

@NgModule({
  imports: [CommonModule, PlatformModule],
  exports: [DtInput],
  declarations: [DtInput],
})
export class DtInputModule {}

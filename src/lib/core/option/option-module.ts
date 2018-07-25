import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtOption } from './option';
import { DtOptgroup } from './optgroup';

@NgModule({
  imports: [CommonModule],
  exports: [DtOption, DtOptgroup],
  declarations: [DtOption, DtOptgroup],
})
export class DtOptionModule {}

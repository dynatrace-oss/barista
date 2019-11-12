import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtOptgroup } from './optgroup';
import { DtOption } from './option';

@NgModule({
  imports: [CommonModule],
  exports: [DtOption, DtOptgroup],
  declarations: [DtOption, DtOptgroup],
})
export class DtOptionModule {}

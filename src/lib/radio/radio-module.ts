import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtRadioButton } from './radio';
import { DtRadioGroup } from './radio-group';

@NgModule({
  imports: [CommonModule, A11yModule],
  exports: [DtRadioButton, DtRadioGroup],
  declarations: [DtRadioButton, DtRadioGroup],
})
export class DtRadioModule {}

import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtCheckbox, DtCheckboxRequiredValidator } from './checkbox';

@NgModule({
  imports: [CommonModule, A11yModule],
  exports: [DtCheckbox, DtCheckboxRequiredValidator],
  declarations: [DtCheckbox, DtCheckboxRequiredValidator],
})
export class DtCheckboxModule {}

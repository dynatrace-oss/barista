import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtButtonGroup, DtButtonGroupItem } from './button-group';

@NgModule({
  imports: [CommonModule, A11yModule],
  exports: [DtButtonGroup, DtButtonGroupItem],
  declarations: [DtButtonGroup, DtButtonGroupItem],
})
export class DtButtonGroupModule {}

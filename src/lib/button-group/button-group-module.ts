import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { DtButtonGroup } from './button-group';
import { DtButtonGroupItem } from './button-group-item';

@NgModule({
  imports: [
    CommonModule,
    A11yModule,
  ],
  exports: [
    DtButtonGroup,
    DtButtonGroupItem,
  ],
  declarations: [
    DtButtonGroup,
    DtButtonGroupItem,
  ],
})
export class DtButtonGroupModule { }

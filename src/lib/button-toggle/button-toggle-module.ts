import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { DtButtonToggle } from './button-toggle';
import { DtButtonToggleItem } from './button-toggle-item';

@NgModule({
  imports: [
    CommonModule,
    A11yModule,
  ],
  exports: [
    DtButtonToggle,
    DtButtonToggleItem,
  ],
  declarations: [
    DtButtonToggle,
    DtButtonToggleItem,
  ],
})
export class DtButtonToggleModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { DtButtongroup, DtButtongroupItem } from './buttongroup';

@NgModule({
  imports: [
    CommonModule,
    A11yModule,
  ],
  exports: [
    DtButtongroup,
    DtButtongroupItem,
  ],
  declarations: [
    DtButtongroup,
    DtButtongroupItem,
  ],
})
export class DtButtongroupModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { DtExpandablePanel, DtExpandablePanelTrigger } from './expandable-panel';

@NgModule({
  imports: [
    CommonModule,
    A11yModule,
  ],
  exports: [
    DtExpandablePanel,
    DtExpandablePanelTrigger,
  ],
  declarations: [
    DtExpandablePanel,
    DtExpandablePanelTrigger,
  ],
})
export class DtExpandablePanelModule { }

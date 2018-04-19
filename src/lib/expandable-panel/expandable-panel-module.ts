import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { DtExpandablePanelTrigger } from './expandable-panel-trigger';
import { DtExpandablePanel } from './expandable-panel';

@NgModule({
  imports: [
    CommonModule,
    A11yModule,
  ],
  exports: [
    DtExpandablePanelTrigger,
    DtExpandablePanel,
  ],
  declarations: [
    DtExpandablePanelTrigger,
    DtExpandablePanel,
  ],
})
export class DtExpandablePanelModule { }

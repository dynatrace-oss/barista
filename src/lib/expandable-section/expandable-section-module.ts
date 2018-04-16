import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { DtExpandableSection, DtExpandableSectionHeader } from './expandable-section';
import { DtExpandablePanelModule } from '@dynatrace/angular-components/expandable-panel';

@NgModule({
  imports: [
    CommonModule,
    A11yModule,
    DtExpandablePanelModule,
  ],
  exports: [
    DtExpandableSection,
    DtExpandableSectionHeader,
  ],
  declarations: [
    DtExpandableSection,
    DtExpandableSectionHeader,
  ],
})
export class DtExpandableSectionModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { DtExpandableSection } from './expandable-section';

@NgModule({
  imports: [
    CommonModule,
    A11yModule,
  ],
  exports: [
    DtExpandableSection,
  ],
  declarations: [
    DtExpandableSection,
  ],
})
export class DtExpandableSectionModule { }

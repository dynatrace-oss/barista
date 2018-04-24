import { NgModule } from '@angular/core';
import { DtExpandableSection, DtExpandableSectionHeader } from './expandable-section';
import { DtExpandablePanelModule } from '@dynatrace/angular-components/expandable-panel';

@NgModule({
  imports: [
    DtExpandablePanelModule,
  ],
  exports: [
    DtExpandableSection,
    DtExpandableSectionHeader,
    DtExpandablePanelModule,
  ],
  declarations: [
    DtExpandableSection,
    DtExpandableSectionHeader,
  ],
})
export class DtExpandableSectionModule { }

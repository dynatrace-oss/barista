import { NgModule } from '@angular/core';
import { DtExpandableSection, DtExpandableSectionHeader } from './expandable-section';
import { DtExpandablePanelModule } from '@dynatrace/angular-components/expandable-panel';
import { DtIconModule } from '@dynatrace/angular-components/icon';

@NgModule({
  imports: [
    DtExpandablePanelModule,
    DtIconModule,
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

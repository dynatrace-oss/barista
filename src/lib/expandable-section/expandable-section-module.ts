import { NgModule } from '@angular/core';
import { DtExpandableSection, DtExpandableSectionHeader } from './expandable-section';
import { DtExpandablePanelModule } from '../expandable-panel/expandable-panel-module';

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

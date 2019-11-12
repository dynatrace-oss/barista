import { NgModule } from '@angular/core';

import { DtExpandablePanelModule } from '@dynatrace/barista-components/expandable-panel';
import { DtIconModule } from '@dynatrace/barista-components/icon';

import {
  DtExpandableSection,
  DtExpandableSectionHeader,
} from './expandable-section';

@NgModule({
  imports: [DtExpandablePanelModule, DtIconModule],
  exports: [DtExpandableSection, DtExpandableSectionHeader],
  declarations: [DtExpandableSection, DtExpandableSectionHeader],
})
export class DtExpandableSectionModule {}

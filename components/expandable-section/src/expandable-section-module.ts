import { NgModule } from '@angular/core';

import { DtExpandablePanelModule } from '@dynatrace/angular-components/expandable-panel';
import { DtIconModule } from '@dynatrace/angular-components/icon';

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

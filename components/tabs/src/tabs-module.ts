import { A11yModule } from '@angular/cdk/a11y';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtColorModule } from '@dynatrace/barista-components/core';

import { DtTabGroupNavigation } from './navigation/tab-group-navigation';
import { DtTabGroup } from './tab-group';
import { DtTab } from './tab/tab';
import { DtTabBody, DtTabBodyPortalOutlet } from './tab/tab-body';
import { DtTabContent } from './tab/tab-content';
import { DtTabLabel } from './tab/tab-label';

const DIRECTIVES = [
  DtTabGroup,
  DtTab,
  DtTabLabel,
  DtTabContent,
  DtTabBody,
  DtTabBodyPortalOutlet,
  DtTabGroupNavigation,
];

@NgModule({
  imports: [A11yModule, CommonModule, PortalModule, DtColorModule],
  exports: DIRECTIVES,
  declarations: DIRECTIVES,
})
export class DtTabsModule {}

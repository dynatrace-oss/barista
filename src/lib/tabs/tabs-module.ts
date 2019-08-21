import { A11yModule } from '@angular/cdk/a11y';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtColorModule } from '@dynatrace/angular-components/core';

import { DtTabGroupNavigation } from './navigation/tab-group-navigation';
import { DtTabGroup } from './tab-group';
import { DtTab } from './tab/tab';
import { DtTabBody, DtTabBodyPortal } from './tab/tab-body';
import { DtTabContent } from './tab/tab-content';
import { DtTabLabel } from './tab/tab-label';

@NgModule({
  imports: [A11yModule, CommonModule, PortalModule, DtColorModule],
  exports: [DtTabGroup, DtTab, DtTabLabel, DtTabContent, DtTabGroupNavigation],
  declarations: [
    DtTabGroup,
    DtTab,
    DtTabLabel,
    DtTabContent,
    DtTabBody,
    DtTabBodyPortal,
    DtTabGroupNavigation,
  ],
})
export class DtTabsModule {}

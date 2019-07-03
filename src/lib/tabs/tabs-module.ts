import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { DtColorModule } from '@dynatrace/angular-components/core';
import { DtTabGroup } from './tab-group';
import { DtTab } from './tab/tab';
import { DtTabLabel } from './tab/tab-label';
import { DtTabContent } from './tab/tab-content';
import { DtTabBody, DtTabBodyPortal } from './tab/tab-body';
import { DtTabGroupNavigation } from './navigation/tab-group-navigation';
import { A11yModule } from '@angular/cdk/a11y';

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

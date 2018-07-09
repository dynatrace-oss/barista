import { NgModule } from '@angular/core';
import { DtTabGroup } from './tab-group';
import { DtTab } from './tab';
import { DtTabLabel } from './tab-label';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { DtColorModule } from '@dynatrace/angular-components/core';

@NgModule({
  imports: [
    CommonModule,
    PortalModule,
    DtColorModule,
  ],
  exports: [
    DtTabGroup,
    DtTab,
    DtTabLabel,
  ],
  declarations: [
    DtTabGroup,
    DtTab,
    DtTabLabel,
  ],
})
export class DtTabsModule {}

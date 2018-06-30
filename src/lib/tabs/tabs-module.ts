import { NgModule } from '@angular/core';
import { DtTabGroup } from './tab-group';
import { DtTab } from './tab';
import { DtTabLabel } from './tab-label';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  imports: [
    CommonModule,
    PortalModule,
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

import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtThemingModule } from '@dynatrace/angular-components/theming';

import { DtOverlayContainer } from './overlay-container';
import { DtOverlayTrigger } from './overlay-trigger';

const EXPORTED_DECLARATIONS = [DtOverlayContainer, DtOverlayTrigger];

@NgModule({
  imports: [
    CommonModule,
    DtButtonModule,
    DtThemingModule,
    OverlayModule,
    PortalModule,
    A11yModule,
  ],
  exports: [...EXPORTED_DECLARATIONS],
  declarations: [...EXPORTED_DECLARATIONS],
  entryComponents: [DtOverlayContainer],
})
export class DtOverlayModule {}

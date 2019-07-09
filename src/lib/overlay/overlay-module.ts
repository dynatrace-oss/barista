import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtThemingModule } from '@dynatrace/angular-components/theming';
import { DtOverlayContainer } from './overlay-container';
import { DtOverlayTrigger } from './overlay-trigger';
import { PortalModule } from '@angular/cdk/portal';

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

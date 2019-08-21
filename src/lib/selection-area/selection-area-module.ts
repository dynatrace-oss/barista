import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';

import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtIconModule } from '@dynatrace/angular-components/icon';

import { DtSelectionArea } from './selection-area';
import { DtSelectionAreaActions } from './selection-area-actions';
import { DtSelectionAreaContainer } from './selection-area-container';
import { DtSelectionAreaOrigin } from './selection-area-origin';

/**
 * @deprecated The selection area will be replaced with the chart selection area
 * @breaking-change To be removed with 5.0.0.
 */
// tslint:disable: deprecation
@NgModule({
  imports: [
    DtIconModule,
    DtButtonModule,
    OverlayModule,
    A11yModule,
    PortalModule,
  ],
  exports: [DtSelectionArea, DtSelectionAreaOrigin, DtSelectionAreaActions],
  declarations: [
    DtSelectionArea,
    DtSelectionAreaContainer,
    DtSelectionAreaOrigin,
    DtSelectionAreaActions,
  ],
  entryComponents: [DtSelectionAreaContainer],
})
export class DtSelectionAreaModule {}

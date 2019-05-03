import { NgModule } from '@angular/core';
import { DtProgressBarModule } from '@dynatrace/angular-components/progress-bar';
import { DtThemingModule } from '@dynatrace/angular-components/theming';
import { DtConsumption } from './consumption';
import {
  DtConsumptionCount,
  DtConsumptionIcon,
  DtConsumptionLabel,
  DtConsumptionOverlay,
  DtConsumptionSubtitle,
  DtConsumptionTitle,
} from './consumption-directives';

const CONSUMPTION_DIRECTIVES = [
  DtConsumption,
  DtConsumptionTitle,
  DtConsumptionSubtitle,
  DtConsumptionIcon,
  DtConsumptionCount,
  DtConsumptionLabel,
  DtConsumptionOverlay,
];

@NgModule({
  exports: CONSUMPTION_DIRECTIVES,
  declarations: CONSUMPTION_DIRECTIVES,
  imports: [DtProgressBarModule, DtThemingModule],
})
export class DtConsumptionModule {}

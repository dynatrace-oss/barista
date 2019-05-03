import { Component } from '@angular/core';
import { DtConsumptionThemePalette } from '@dynatrace/angular-components/consumption';

@Component({
  moduleId: module.id,
  selector: 'consumption-demo',
  templateUrl: './consumption-demo.component.html',
  styleUrls: ['./consumption-demo.component.scss'],
})
export class ConsumptionDemo {
  min = 0;
  max = 20;
  value = 5;
  color: DtConsumptionThemePalette = 'main';
  // tslint:disable-next-line:no-magic-numbers
  defaultBreakdown = [
    { name: 'SAAS', value: 2 },
    { name: 'Full stack', value: 2 },
    { name: 'PAAS', value: 1 },
  ];

  warningMin = 0;
  warningMax = 130_500_000;
  warningValue = 120_000_000;
  warningColor: DtConsumptionThemePalette = 'warning';
  // tslint:disable-next-line:no-magic-numbers
  warningBreakdown = [
    { name: 'Synthetic actions', value: 36_500_000 },
    { name: 'Sessions', value: 37_400_000 },
    { name: 'Sessions w/ replay data', value: 36_600_000 },
  ];

  errorMin = 0;
  errorMax = 8_000_000_000;
  errorValue = 8_000_000_000;
  errorColor: DtConsumptionThemePalette = 'error';

  noOverlayMin = 0;
  noOverlayMax = 55_000_000;
  noOverlayValue = 45_600_000;
  noOverlayColor: DtConsumptionThemePalette = 'main';
}

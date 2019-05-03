import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-consumption-ui',
  templateUrl: 'consumption-ui.html',
})
export class ConsumptionUI {
  min = 0;
  max = 100;
  value = 25;
}

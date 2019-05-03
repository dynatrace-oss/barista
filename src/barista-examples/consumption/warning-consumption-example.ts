import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'warning-consumption-example',
  template: `
    <dt-consumption [min]="min" [max]="max" [value]="value" color="warning">
      <dt-consumption-icon aria-label="User Group">
        <dt-icon name="usergroup"></dt-icon>
      </dt-consumption-icon>
      <dt-consumption-title>
        DEM units
      </dt-consumption-title>

      <dt-consumption-count>
        {{ value | dtCount }}/{{ max | dtCount }}
      </dt-consumption-count>

      <dt-consumption-label>
        Flexible overages
      </dt-consumption-label>

      <dt-consumption-overlay>
        <dt-consumption
          [min]="0"
          [max]="100000000"
          [value]="100000000"
          color="warning"
          class="overlay-value-panel"
        >
          <dt-consumption-title>
            DEM units
          </dt-consumption-title>
          <dt-consumption-subtitle>
            Quota
          </dt-consumption-subtitle>
          <dt-consumption-count>
            {{ 100000000 | dtCount }}/{{ 100000000 | dtCount }}
          </dt-consumption-count>
        </dt-consumption>

        <dt-consumption
          [min]="0"
          [max]="10500000"
          [value]="10500000"
          color="warning"
          class="overlay-value-panel"
        >
          <dt-consumption-subtitle>
            Flexible overages
          </dt-consumption-subtitle>
          <dt-consumption-count>
            {{ 10500000 | dtCount }}/unlimited
          </dt-consumption-count>
        </dt-consumption>

        <div class="overlay-value-panel">
          <div>Consumption breakdown</div>
          <dt-key-value-list>
            <dt-key-value-list-item *ngFor="let entry of breakdown">
              <dt-key-value-list-key>{{ entry.name }}</dt-key-value-list-key>
              <dt-key-value-list-value>
                {{ entry.value | dtCount }}
              </dt-key-value-list-value>
            </dt-key-value-list-item>
          </dt-key-value-list>
        </div>

        <dt-consumption
          [min]="0"
          [max]="20000000"
          [value]="20000000"
          color="warning"
          class="overlay-value-panel"
        >
          <dt-consumption-subtitle>
            Free (Exp. 20. Mar 2019)
          </dt-consumption-subtitle>
          <dt-consumption-count>
            {{ 20000000 | dtCount }}/{{ 20000000 | dtCount }}
          </dt-consumption-count>
        </dt-consumption>
      </dt-consumption-overlay>
    </dt-consumption>
  `,
})
export class WarningConsumptionExample {
  min = 0;
  max = 20;
  value = 5;
  breakdown = [
    { name: 'Synthetic actions', value: 36_500_000 },
    { name: 'Sessions', value: 37_400_000 },
    { name: 'Sessions w/ replay data', value: 36_600_000 },
  ];
}

import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'warning-consumption-example',
  template: `
    <dt-consumption [max]="max" [value]="value" color="warning">
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
          [max]="quota"
          [value]="quota"
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
            {{ quota | dtCount }}/{{ quota | dtCount }}
          </dt-consumption-count>
        </dt-consumption>

        <dt-consumption
          [min]="0"
          [max]="flexibleOverages"
          [value]="flexibleOverages"
          color="warning"
          class="overlay-value-panel"
        >
          <dt-consumption-subtitle>
            Flexible overages
          </dt-consumption-subtitle>
          <dt-consumption-count>
            {{ flexibleOverages | dtCount }}/unlimited
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
          [max]="free"
          [value]="free"
          color="warning"
          class="overlay-value-panel"
        >
          <dt-consumption-subtitle>
            Free (Exp. 20. Mar 2019)
          </dt-consumption-subtitle>
          <dt-consumption-count>
            {{ free | dtCount }}/{{ free | dtCount }}
          </dt-consumption-count>
        </dt-consumption>
      </dt-consumption-overlay>
    </dt-consumption>
  `,
})
export class ConsumptionWarningExample {
  max = 120_000_000;
  value = 130_500_000;

  free = 20_000_000;
  quota = 100_000_000;
  flexibleOverages = 10_500_000;

  breakdown = [
    { name: 'Synthetic actions', value: 36_500_000 },
    { name: 'Sessions', value: 37_400_000 },
    { name: 'Sessions w/ replay data', value: 36_600_000 },
  ];
}

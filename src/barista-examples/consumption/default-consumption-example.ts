import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'default-consumption-example',
  template: `
    <dt-consumption [min]="min" [max]="max" [value]="value">
      <dt-consumption-icon aria-label="Host">
        <dt-icon name="host"></dt-icon>
      </dt-consumption-icon>
      <dt-consumption-title>
        Host units
      </dt-consumption-title>

      <dt-consumption-count>
        {{ value | dtCount }}/{{ max | dtCount }}
      </dt-consumption-count>

      <dt-consumption-label>
        Restricted host unit hours
      </dt-consumption-label>

      <dt-consumption-overlay>
        <dt-consumption
          [min]="0"
          [max]="100000000"
          [value]="100000000"
          class="overlay-value-panel"
        >
          <dt-consumption-title>
            Host units
          </dt-consumption-title>
          <dt-consumption-subtitle>
            Quota
          </dt-consumption-subtitle>
          <dt-consumption-count>
            {{ value | dtCount }}/{{ max | dtCount }}
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
          [max]="5"
          [value]="0"
          class="overlay-value-panel"
        >
          <dt-consumption-subtitle>
            Free credits (Exp. 20. Mar 2019)
          </dt-consumption-subtitle>
          <dt-consumption-count>
            {{ 0 | dtCount }}/{{ 5 | dtCount }}
          </dt-consumption-count>
        </dt-consumption>
      </dt-consumption-overlay>
    </dt-consumption>
  `,
})
export class DefaultConsumptionExample {
  min = 0;
  max = 20;
  value = 5;
  breakdown = [
    { name: 'SAAS', value: 2 },
    { name: 'Full stack', value: 2 },
    { name: 'PAAS', value: 1 },
  ];
}

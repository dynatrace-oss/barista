import { Component } from '@angular/core';

@Component({
  template: `
  <p>OldValue: {{oldValue}}<br>NewValue: {{newValue}}</p>
  <dt-progress-circle (valueChange)="changed($event)" [value]="value">
  </dt-progress-circle>
  <div>
  <button dt-button (click)="value=value+10">increase by 10</button>
  <button dt-button (click)="value=value-10">decrease by 10</button>
  </div>
  `,
})
export class ChangeProgressCircleExampleComponent {
  oldValue = 0;
  newValue = 0;
  value = 0;

  changed($event: { oldValue: number; newValue: number }): void {
    this.oldValue = $event.oldValue;
    this.newValue = $event.newValue;
  }
}

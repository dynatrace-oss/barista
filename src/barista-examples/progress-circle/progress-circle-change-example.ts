import { Component } from '@angular/core';

@Component({
  selector: 'barista-demo',
  template: `
    <p>Value passed to the progress circle: {{ value }}</p>
    <dt-progress-circle
      (valueChange)="changed($event)"
      [value]="value"
    ></dt-progress-circle>
    <div>
      <button dt-button (click)="value = value - 10">decrease by 10</button>
      <button dt-button (click)="value = value + 10">increase by 10</button>
    </div>
    <p *ngIf="oldValue !== null">
      Event: OldValue: {{ oldValue }}
      <br />
      NewValue: {{ newValue }}
    </p>
  `,
})
export class ProgressCircleChangeExample {
  oldValue: number | null = null;
  newValue: number | null = null;
  value = 0;

  changed($event: { oldValue: number; newValue: number }): void {
    this.oldValue = $event.oldValue;
    this.newValue = $event.newValue;
  }
}

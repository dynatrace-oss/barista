import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-bar-indicator [value]="value" [min]="min" [max]="max" (valueChange)="changed($event)"></dt-bar-indicator>
    <div style="margin-top: 16px;">
      <button dt-button (click)="value=value-10">decrease value by 10</button>
      <button dt-button (click)="value=value+10">increase value by 10</button>
    </div>
    <div style="margin-top: 16px;">
      <button dt-button (click)="min=min-10">decrease min by 10</button>
      <button dt-button (click)="min=min+10">increase min by 10</button>
    </div>
    <div style="margin-top: 16px;">
      <button dt-button (click)="max=max-10">decrease max by 10</button>
      <button dt-button (click)="max=max+10">increase max by 10</button>
    </div>
    <p>
      Current value: {{value}}<br>
      Current min: {{min}}<br>
      Current max: {{max}}<br>
    </p>
    <p *ngIf="oldValue!==null">Event: OldValue: {{oldValue}}<br>NewValue: {{newValue}}</p>
  `,
})
export class DynamicBarIndicatorExampleComponent {
  min = 0;
  max = 100;
  value = 50;

  oldValue: number | null = null;
  newValue: number | null = null;

  changed($event: { oldValue: number; newValue: number }): void {
    this.oldValue = $event.oldValue;
    this.newValue = $event.newValue;
  }
}

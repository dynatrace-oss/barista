import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<div>
  <dt-button-toggle #control1 [disabled]="control1AllDisabled">
    <ng-container *ngFor="let gvalue of groupValues; let i = index">
      <dt-button-toggle-item
        *ngIf="!control1secondOdd || i % 2 === 0"
        [value]="gvalue.key"
        [disabled]="i === 2 && control1secondDisabled"
        [selected]="i === 1"
      >{{gvalue.name}}
      </dt-button-toggle-item>
    </ng-container>
  </dt-button-toggle>
</div>
<div style="margin-top: .5em;">Current value: {{ control1.value }}</div>
<div style="margin-top: .5em;">
  <button dt-button (click)="control1.clearSelection()">Clear selection</button>
  <button dt-button (click)="control1.selectValue(groupValues[0].key)">Select 1<sup>st</sup> key</button>
  <button dt-button (click)="control1.selectValue(groupValues[1].key)">Select 2<sup>nd</sup> key</button>
  <button dt-button (click)="control1AllDisabled=!control1AllDisabled">Toggle all disabled</button>
  <button dt-button (click)="control1secondDisabled=!control1secondDisabled">Toggle 3<sup>rd</sup> disabled</button>
  <button dt-button (click)="control1secondOdd=!control1secondOdd">Toggle odd items</button>
</div>`,
})
export class ButtonToggleInteractiveExampleComponent {
  groupValues: { key: string, name: string }[] = [
    { key: 'perf', name: 'Performance' },
    { key: 'conn', name: 'Connectivity' },
    { key: 'fail', name: 'Failure rate' },
    { key: 'av', name: 'Availability' },
    { key: 'cpu', name: 'CPU' },
  ];
}

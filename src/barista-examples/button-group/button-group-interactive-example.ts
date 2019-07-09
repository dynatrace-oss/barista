import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  // @formatter:off
  template: `
    <div>
      <dt-button-group #control1 [disabled]="control1AllDisabled">
        <ng-container *ngFor="let gvalue of groupValues; let i = index">
          <dt-button-group-item
            *ngIf="!control1secondOdd || i % 2 === 0"
            [value]="gvalue.key"
            [disabled]="i === 2 && control1secondDisabled"
            >{{ gvalue.name }}
          </dt-button-group-item>
        </ng-container>
      </dt-button-group>
    </div>
    <div style="margin-top: .5em;">Current value: {{ control1.value }}</div>
    <div style="margin-top: .5em;">
      <button dt-button (click)="control1.value = groupValues[0].key"
        >Select 1<sup>st</sup> key</button
      >
      <button dt-button (click)="control1.value = groupValues[1].key"
        >Select 2<sup>nd</sup> key</button
      >
      <button dt-button (click)="control1AllDisabled = !control1AllDisabled"
        >Toggle all disabled</button
      >
      <button
        dt-button
        (click)="control1secondDisabled = !control1secondDisabled"
        >Toggle 3<sup>rd</sup> disabled</button
      >
      <button dt-button (click)="control1secondOdd = !control1secondOdd"
        >Toggle odd items</button
      >
    </div>
  `,
  // @formatter:on
})
export class ButtonGroupInteractiveExample {
  groupValues: Array<{ key: string; name: string }> = [
    { key: 'perf', name: 'Performance' },
    { key: 'conn', name: 'Connectivity' },
    { key: 'fail', name: 'Failure rate' },
    { key: 'av', name: 'Availability' },
    { key: 'cpu', name: 'CPU' },
  ];
  control1AllDisabled = false;
  control1secondDisabled = false;
  control1secondOdd = false;
}

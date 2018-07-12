import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  moduleId: module.id,
  template: `
  <button dt-button (click)="disableFirst=!disableFirst">Toggle disable for first tab</button>
  <button dt-button [disabled]="simulationRunning" (click)="simulateError()">Simulate Error</button>
  <dt-tab-group>
    <dt-tab [disabled]="disableFirst">
      <ng-template dtTabLabel>Physical <em>CPU</em></ng-template>
      <ng-template dtTabContent>
        <h1>pu-ready-time-recovered</h1>
        <button dt-button>initialize</button>
        <input type="text" value="some">
      </ng-template>
    </dt-tab>
    <dt-tab [color]="simulatedColor" selected>
      <ng-template dtTabLabel>CPU ready time</ng-template>
      <ng-template dtTabContent>
        <h1>CPU-ready-time</h1>
        <button dt-button>initialize</button>
      </ng-template>
    </dt-tab>
  </dt-tab-group>
  `,
})
@OriginalClassName('InteractiveTabsExampleComponent')
export class InteractiveTabsExampleComponent {
  simulatedColor = 'main';
  simulationRunning = false;
  disableFirst = false;

  simulateError(): void {
    this.simulatedColor = 'error';
    this.simulationRunning = true;
    // tslint:disable-next-line:no-magic-numbers
    timer(1000, 1000)
    // tslint:disable-next-line:no-magic-numbers
    .pipe(take(2))
    .subscribe(
      () => {
        this.simulatedColor = this.simulatedColor === 'error' ? 'recovered' : 'main';
      },
      undefined,
      () => {
        this.simulationRunning = false;
      });
  }
}

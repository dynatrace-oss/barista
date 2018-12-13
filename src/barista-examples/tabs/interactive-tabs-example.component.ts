import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  moduleId: module.id,
  template: `
  <dt-tab-group>
    <dt-tab [disabled]="disableFirst">
      <ng-template dtTabLabel>Traffic</ng-template>
      <ng-template dtTabContent>
        <h3>Traffic</h3>
      </ng-template>
    </dt-tab>
    <dt-tab [color]="simulatedColor" selected>
      <ng-template dtTabLabel>Connectivity {{connectivity}}</ng-template>
      <ng-template dtTabContent>
        <h3>Connectivity</h3>
      </ng-template>
    </dt-tab>
  </dt-tab-group>
  <button dt-button (click)="disableFirst=!disableFirst">Toggle disable for first tab</button>
  <button dt-button [disabled]="simulationRunning" (click)="simulateError()">Simulate Error</button>
  `,
})
export class InteractiveTabsExampleComponent {
  simulatedColor = 'main';
  simulationRunning = false;
  disableFirst = false;
  connectivity = '100%';

  simulateError(): void {
    this.simulatedColor = 'error';
    this.simulationRunning = true;
    this.connectivity = '30%';
    // tslint:disable-next-line:no-magic-numbers
    timer(1000, 1000)
    // tslint:disable-next-line:no-magic-numbers
    .pipe(take(2))
    .subscribe(
      () => {
        this.simulatedColor = this.simulatedColor === 'error' ? 'recovered' : 'main';
        this.connectivity = '80%';
      },
      undefined,
      () => {
        this.simulationRunning = false;
        this.connectivity = '100%';
      });
  }
}

import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-context-dialog
      aria-label="Show more details"
      aria-label-close-button="Close context dialog"
    >
      <dt-menu aria-label="Menu inside Popup Example">
        <dt-menu-group label="Dashboards & reports">
          <a routerLink="/dashboards" dtMenuItem>Dashboards</a>
          <a routerLink="/customchart" dtMenuItem>Create custom chart</a>
          <a routerLink="/reports" dtMenuItem>Reports</a>
          <button (click)="doSomething()" dtMenuItem>Something else</button>
        </dt-menu-group>

        <dt-menu-group label="Analyze">
          <a routerLink="/problems" dtMenuItem>Problems</a>
          <a routerLink="/usersessions" dtMenuItem>User sessions</a>
          <a routerLink="/smartscape" dtMenuItem>Smartscape topology</a>
          <a routerLink="/diagnostic" dtMenuItem>Diagnostic tools</a>
        </dt-menu-group>

        <a routerLink="/help" dtMenuItem>Item outside a group</a>
      </dt-menu>
    </dt-context-dialog>
  `,
})
export class MenuWithinContextDialogExample {
  doSomething(): void {
    // noop
  }
}

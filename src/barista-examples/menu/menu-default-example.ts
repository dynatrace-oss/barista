import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <dt-menu aria-label="Default Menu Example" class="default-menu-example">
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
  `,
  styles: [
    `
      .default-menu-example {
        width: 240px;
      }
    `,
  ],
})
export class MenuDefaultExample {
  doSomething(): void {
    // noop
  }
}

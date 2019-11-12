import { Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DtDrawer } from '@dynatrace/barista-components/drawer';

@Component({
  selector: 'top-bar-navigation-drawer-barista-example',
  styles: [
    `
      dt-drawer {
        background: #525252;
        width: 30%;
      }
      dt-drawer button {
        background: #525252;
        position: absolute;
        right: 0;
        top: 0;
      }
    `,
  ],
  template: `
    <dt-drawer-container class="drawer">
      <dt-drawer>
        <button dtTopBarAction (click)="closeDrawer()">
          <dt-icon name="menu-close"></dt-icon>
        </button>
      </dt-drawer>
      <dt-top-bar-navigation aria-label="Main">
        <dt-top-bar-navigation-item align="start" *ngIf="showHamburger | async">
          <button dtTopBarAction (click)="openDrawer()">
            <dt-icon name="menu-hamburger"></dt-icon>
          </button>
        </dt-top-bar-navigation-item>

        <dt-top-bar-navigation-item align="end">
          <button dtTopBarAction>my button</button>
        </dt-top-bar-navigation-item>

        <dt-top-bar-navigation-item align="end" *ngIf="problems > 0">
          <a href="" dtTopBarAction hasProblem>{{ problems }}</a>
        </dt-top-bar-navigation-item>

        <dt-top-bar-navigation-item align="end">
          <button dtTopBarAction><dt-icon name="user-uem"></dt-icon></button>
        </dt-top-bar-navigation-item>
      </dt-top-bar-navigation>
    </dt-drawer-container>
  `,
})
export class TopBarNavigationDrawerExample {
  @ViewChild(DtDrawer, { static: true }) drawer: DtDrawer;

  problems = 60;
  showHamburger = new BehaviorSubject(true);

  openDrawer(): void {
    this.drawer.open();
    this.showHamburger.next(false);
  }

  closeDrawer(): void {
    this.drawer.close();
    this.showHamburger.next(true);
  }
}

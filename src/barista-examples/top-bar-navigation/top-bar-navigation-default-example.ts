import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'top-bar-navigation-barista-example',
  template: `
    <dt-top-bar-navigation aria-label="Main">
      <dt-top-bar-navigation-item align="start">
        <a routerLink="" dtTopBarAction>
          <dt-icon name="menu-hamburger"></dt-icon>
        </a>
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
  `,
})
export class TopBarNavigationDefaultExample {
  problems = 61;
}

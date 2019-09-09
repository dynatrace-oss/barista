import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'top-bar-navigation-barista-example',
  template: `
    <dt-top-bar-navigation aria-label="Main">
      <dt-top-bar-navigation-item align="start">
        <a routerLink="" dt-top-bar-action>
          <dt-icon name="menu-hamburger"></dt-icon>
        </a>
      </dt-top-bar-navigation-item>

      <dt-top-bar-navigation-item align="end">
        <button dt-top-bar-action>my button</button>
      </dt-top-bar-navigation-item>

      <dt-top-bar-navigation-item align="end" *ngIf="problems > 0">
        <a href="" dt-top-bar-action hasProblem>{{ problems }}</a>
      </dt-top-bar-navigation-item>

      <dt-top-bar-navigation-item align="end">
        <button dt-top-bar-action><dt-icon name="user-uem"></dt-icon></button>
      </dt-top-bar-navigation-item>
    </dt-top-bar-navigation>
  `,
})
export class TopBarNavigationDefaultExample {
  problems = 61;
}

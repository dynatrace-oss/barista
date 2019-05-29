import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  styles: ['button { margin-top: 24px; }'],
  template: `
    <dt-secondary-nav aria-label="Active Section Secondary Nav Example">
      <dt-secondary-nav-title>Settings</dt-secondary-nav-title>
      <dt-secondary-nav-section expandable [active]="active">
        <dt-secondary-nav-section-title>
          Monitoring
        </dt-secondary-nav-section-title>
        <dt-secondary-nav-section-description>
          Setup and overview
        </dt-secondary-nav-section-description>
        <a
          dtSecondaryNavLink
          routerLink="/"
          [class.dt-secondary-nav-active]="active"
        >
          Monitored technologies
        </a>
        <a dtSecondaryNavLink routerLink="/">Monitoring overview</a>
        <a dtSecondaryNavLink routerLink="/">Host naming</a>
      </dt-secondary-nav-section>
    </dt-secondary-nav>
    <button dt-button (click)="active = !active">toggle active</button>
  `,
})
export class SecondaryNavActiveExample {
  active = true;
}

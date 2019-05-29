import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  styles: ['input { margin-top: 24px; }'],
  template: `
    <dt-secondary-nav aria-label="Title Secondary Nav Example">
      <dt-secondary-nav-title *ngIf="title">{{ title }}</dt-secondary-nav-title>
      <dt-secondary-nav-section expandable>
        <dt-secondary-nav-section-title>
          Monitoring
        </dt-secondary-nav-section-title>
        <dt-secondary-nav-section-description>
          Setup and overview
        </dt-secondary-nav-section-description>
        <a dtSecondaryNavLink routerLink="/">
          Monitored technologies
        </a>
        <a dtSecondaryNavLink routerLink="/">Monitoring overview</a>
        <a dtSecondaryNavLink routerLink="/">Host naming</a>
      </dt-secondary-nav-section>
    </dt-secondary-nav>
    <input
      type="text"
      dtInput
      placeholder="Please insert title"
      aria-label="Please insert title"
      [(ngModel)]="title"
    />
  `,
})
export class SecondaryNavTitleExample {
  title = 'Settings';
}

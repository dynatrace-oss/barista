import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-secondary-nav aria-label="External Links Secondary Nav Example">
      <dt-secondary-nav-title>Settings</dt-secondary-nav-title>

      <dt-secondary-nav-section expandable active>
        <dt-secondary-nav-section-title>
          Monitoring
        </dt-secondary-nav-section-title>
        <dt-secondary-nav-section-description>
          Setup and overview
        </dt-secondary-nav-section-description>
        <a
          dtSecondaryNavLink
          href="https://google.com"
          class="dt-secondary-nav-active"
        >
          Monitored technologies
        </a>
        <a dtSecondaryNavLink href="https://google.com">Monitoring overview</a>
        <a dtSecondaryNavLink href="https://google.com">Host naming</a>
      </dt-secondary-nav-section>

      <dt-secondary-nav-section href="https://google.com" [external]="true">
        <dt-secondary-nav-section-title
          >External Link</dt-secondary-nav-section-title
        >
        <dt-secondary-nav-section-description
          >Non expanding section</dt-secondary-nav-section-description
        >
      </dt-secondary-nav-section>
    </dt-secondary-nav>
  `,
})
export class SecondaryNavExternalExample {}

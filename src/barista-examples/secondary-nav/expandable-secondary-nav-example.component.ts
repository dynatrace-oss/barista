import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <dt-secondary-nav aria-label="Expandable Secondary Nav Example">
      <dt-secondary-nav-title>Settings</dt-secondary-nav-title>
      <dt-secondary-nav-section href="/" active>
        <dt-secondary-nav-section-title>
          Monitoring
        </dt-secondary-nav-section-title>
        <dt-secondary-nav-section-description>
          Setup and overview
        </dt-secondary-nav-section-description>
      </dt-secondary-nav-section>
      <dt-secondary-nav-section href="/">
        <dt-secondary-nav-section-title>
          Processes and containers
        </dt-secondary-nav-section-title>
        <dt-secondary-nav-section-description>
          Detection and naming
        </dt-secondary-nav-section-description>
      </dt-secondary-nav-section>
      <dt-secondary-nav-section href="/">
        <dt-secondary-nav-section-title>
          Link without description
        </dt-secondary-nav-section-title>
      </dt-secondary-nav-section>
    </dt-secondary-nav>
  `,
})
export class SecondaryNavExpandableExample {}

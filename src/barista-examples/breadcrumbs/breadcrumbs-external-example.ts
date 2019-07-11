import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-breadcrumbs aria-label="Breadcrumbs navigation">
      <dt-breadcrumbs-item href="http://google.com" external>
        google.com
      </dt-breadcrumbs-item>
      <dt-breadcrumbs-item>Current view</dt-breadcrumbs-item>
    </dt-breadcrumbs>
  `,
})
export class BreadcrumbsExternalExample {}

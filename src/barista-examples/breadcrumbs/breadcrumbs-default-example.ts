import { Component } from '@angular/core';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-breadcrumbs aria-label="Breadcrumbs navigation">
      <a dtBreadcrumbsItem href="first">First view</a>
      <a dtBreadcrumbsItem href="first/second">
        Second view
      </a>
      <a dtBreadcrumbsItem href="first/second/third">
        Third view
      </a>
      <a dtBreadcrumbsItem>Current view</a>
    </dt-breadcrumbs>
  `,
})
export class BreadcrumbsDefaultExample {}

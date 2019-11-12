import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <div class="dark" dtTheme=":dark">
      <dt-breadcrumbs aria-label="Breadcrumbs navigation">
        <a dtBreadcrumbsItem href="first">First view</a>
        <a dtBreadcrumbsItem href="first/second">
          Second view
        </a>
        <a dtBreadcrumbsItem>Current view</a>
      </dt-breadcrumbs>
    </div>
  `,
})
export class BreadcrumbsDarkExample {}

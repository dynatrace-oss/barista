import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <div class="dark" dtTheme=":dark">
      <dt-breadcrumbs>
        <dt-breadcrumbs-item href="first">First view</dt-breadcrumbs-item>
        <dt-breadcrumbs-item [href]="['first', 'second', {param: 123}]">Second view</dt-breadcrumbs-item>
        <dt-breadcrumbs-item>Current view</dt-breadcrumbs-item>
      </dt-breadcrumbs>
    </div>
  `,
})
export class DarkBreadcrumbsExampleComponent {
}

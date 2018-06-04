import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  template: `
    <div class="dark" dtTheme=":dark">
      <dt-breadcrumbs>
        <dt-breadcrumbs-item href="first">First view</dt-breadcrumbs-item>
        <dt-breadcrumbs-item [href]="['first', 'second', {param: 123}]">Second view</dt-breadcrumbs-item>
        <dt-breadcrumbs-item [href]="currentUrl">Current view</dt-breadcrumbs-item>
      </dt-breadcrumbs>
    </div>
  `,
})
export class DarkBreadcrumbsExampleComponent {
  constructor(private readonly router: Router) {}

  get currentUrl(): string {
    return this.router.url;
  }
}

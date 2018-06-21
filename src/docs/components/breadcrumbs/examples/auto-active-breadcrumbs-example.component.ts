import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  template: `
    <dt-breadcrumbs>
      <dt-breadcrumbs-item href="first">First view</dt-breadcrumbs-item>
      <dt-breadcrumbs-item [href]="currentUrl">Current view</dt-breadcrumbs-item>
    </dt-breadcrumbs>
  `,
})
export class AutoActiveBreadcrumbsExampleComponent {

  constructor(private readonly router: Router) {}

  get currentUrl(): string {
    return this.router.url;
  }
}

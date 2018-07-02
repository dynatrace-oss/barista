import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
    <dt-breadcrumbs>
      <dt-breadcrumbs-item href="http://google.com" external>google.com</dt-breadcrumbs-item>
      <dt-breadcrumbs-item>Current view</dt-breadcrumbs-item>
    </dt-breadcrumbs>
  `,
})
@OriginalClassName('ExternalBreadcrumbsExampleComponent')
export class ExternalBreadcrumbsExampleComponent {
}

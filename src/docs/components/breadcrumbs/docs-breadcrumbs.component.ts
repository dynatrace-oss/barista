import { Component } from '@angular/core';
import { DefaultBreadcrumbsExampleComponent } from './examples/default-breadcrumbs-example.component';
import { ObservableBreadcrumbsExampleComponent } from './examples/observable-breadcrumbs-example.component';
import { ExternalBreadcrumbsExampleComponent } from './examples/external-breadcrumbs-example.component';
import { DarkBreadcrumbsExampleComponent } from './examples/dark-breadcrumbs-example.component';

@Component({
  selector: 'docs-breadcrumbs',
  templateUrl: 'docs-breadcrumbs.component.html',
})
export class DocsBreadcrumbsComponent {
  examples = {
    default: DefaultBreadcrumbsExampleComponent,
    observable: ObservableBreadcrumbsExampleComponent,
    external: ExternalBreadcrumbsExampleComponent,
    dark: DarkBreadcrumbsExampleComponent,
  };
}

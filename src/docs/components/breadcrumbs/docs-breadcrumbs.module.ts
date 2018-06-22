import { NgModule } from '@angular/core';
import { DefaultBreadcrumbsExampleComponent } from './examples/default-breadcrumbs-example.component';
import { DocsBreadcrumbsComponent } from './docs-breadcrumbs.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtBreadcrumbsModule } from '@dynatrace/angular-components';
import { ObservableBreadcrumbsExampleComponent } from './examples/observable-breadcrumbs-example.component';
import { ExternalBreadcrumbsExampleComponent } from './examples/external-breadcrumbs-example.component';
import { DarkBreadcrumbsExampleComponent } from './examples/dark-breadcrumbs-example.component';
import { AutoActiveBreadcrumbsExampleComponent } from './examples/auto-active-breadcrumbs-example.component';
import { OverrideActiveBreadcrumbsExampleComponent } from './examples/override-active-breadcrumbs-example.component';

const EXAMPLES = [
  DefaultBreadcrumbsExampleComponent,
  ObservableBreadcrumbsExampleComponent,
  ExternalBreadcrumbsExampleComponent,
  DarkBreadcrumbsExampleComponent,
  AutoActiveBreadcrumbsExampleComponent,
  OverrideActiveBreadcrumbsExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtBreadcrumbsModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsBreadcrumbsComponent,
  ],
  exports: [
    DocsBreadcrumbsComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsBreadcrumbsModule {
}

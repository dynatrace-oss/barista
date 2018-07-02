import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DtBreadcrumbsModule } from '@dynatrace/angular-components';
import { COMPONENT_EXAMPLES, UiModule } from '../../ui/ui.module';
import { DarkBreadcrumbsExampleComponent } from './examples/dark-breadcrumbs-example.component';
import { DefaultBreadcrumbsExampleComponent } from './examples/default-breadcrumbs-example.component';
import { ExternalBreadcrumbsExampleComponent } from './examples/external-breadcrumbs-example.component';
import { ObservableBreadcrumbsExampleComponent } from './examples/observable-breadcrumbs-example.component';

export const EXAMPLES = [
  DefaultBreadcrumbsExampleComponent,
  ObservableBreadcrumbsExampleComponent,
  ExternalBreadcrumbsExampleComponent,
  DarkBreadcrumbsExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtBreadcrumbsModule,
  ],
  declarations: [
    ...EXAMPLES,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
  providers: [
    { provide: COMPONENT_EXAMPLES, useValue: EXAMPLES, multi: true },
  ],
})
export class DocsBreadcrumbsModule {
}

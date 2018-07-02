import { NgModule } from '@angular/core';
import { DefaultBreadcrumbsExampleComponent } from './examples/default-breadcrumbs-example.component';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtBreadcrumbsModule } from '@dynatrace/angular-components';
import { ObservableBreadcrumbsExampleComponent } from './examples/observable-breadcrumbs-example.component';
import { ExternalBreadcrumbsExampleComponent } from './examples/external-breadcrumbs-example.component';
import { DarkBreadcrumbsExampleComponent } from './examples/dark-breadcrumbs-example.component';
import { RouterModule } from '@angular/router';

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
    RouterModule.forRoot([], { useHash: true }),
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

import { NgModule } from '@angular/core';
import { DefaultTabsExampleComponent } from './examples/default-tabs-example.component';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtTabsModule, DtButtonModule } from '@dynatrace/angular-components';

export const EXAMPLES = [
  DefaultTabsExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtTabsModule,
    DtButtonModule,
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
export class DocsTabsModule {
}

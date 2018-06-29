import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtThemingModule } from '@dynatrace/angular-components';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { LinkDarkExampleComponent } from './examples/link-dark-example.component';
import { LinkExternalExampleComponent } from './examples/link-external-example.component';
import { LinkSimpleExampleComponent } from './examples/link-simple-example.component';

export const EXAMPLES = [
  LinkSimpleExampleComponent,
  LinkExternalExampleComponent,
  LinkDarkExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    DtThemingModule,
    UiModule,
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
export class DocsLinkModule { }

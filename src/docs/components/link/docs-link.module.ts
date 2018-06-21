import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtThemingModule } from '@dynatrace/angular-components';
import { UiModule } from '../../ui/ui.module';
import { LinkDarkExampleComponent } from './examples/link-dark-example.component';
import { LinkExternalExampleComponent } from './examples/link-external-example.component';
import { LinkSimpleExampleComponent } from './examples/link-simple-example.component';

const EXAMPLES = [
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
})
export class DocsLinkModule { }

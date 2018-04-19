import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from '../../ui/ui.module';
import { DocsLinkComponent } from './docs-link.component';
import { LinkExternalExampleComponent } from './examples/link-external-example.component';
import { LinkSimpleExampleComponent } from './examples/link-simple-example.component';

const EXAMPLES = [
  LinkSimpleExampleComponent,
  LinkExternalExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsLinkComponent,
  ],
  exports: [
    DocsLinkComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsLinkModule { }

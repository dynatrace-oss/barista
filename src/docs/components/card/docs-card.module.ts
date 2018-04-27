import { NgModule } from '@angular/core';
import { DefaultCardExampleComponent } from './examples/card-default-example.component';
import { DocsCardComponent } from './docs-card.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtCardModule, DtButtonModule, DtThemingModule, } from '@dynatrace/angular-components';

const EXAMPLES = [
  DefaultCardExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtCardModule,
    DtButtonModule,
    DtThemingModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsCardComponent,
  ],
  exports: [
    DocsCardComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsCardModule {
}

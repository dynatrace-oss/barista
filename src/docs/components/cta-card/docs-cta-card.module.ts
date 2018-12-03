import { NgModule } from '@angular/core';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtCtaCardModule, DtButtonModule, DtIconModule, } from '@dynatrace/angular-components';
import { DefaultCtaCardExampleComponent } from './examples/default-cta-card-example.component';
import { ClosableCtaCardExampleComponent } from './examples/closable-cta-card-example.component';

export const EXAMPLES = [
  DefaultCtaCardExampleComponent,
  ClosableCtaCardExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtCtaCardModule,
    DtButtonModule,
    DtIconModule,
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
export class DocsCtaCardModule {
}

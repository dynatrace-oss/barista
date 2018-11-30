import { NgModule } from '@angular/core';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtCtaCardModule, DtCardModule, DtButtonModule, DtThemingModule, DtIconModule, } from '@dynatrace/angular-components';
import { DefaultCtaCardExampleComponent } from './examples/default-cta-card-example.component';

export const EXAMPLES = [
  DefaultCtaCardExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtCardModule,
    DtCtaCardModule,
    DtButtonModule,
    DtThemingModule,
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

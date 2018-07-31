import { NgModule } from '@angular/core';
import { DefaultOverlayExampleComponent } from './examples/default-overlay-example.component';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtOverlayModule, DtButtonModule } from '@dynatrace/angular-components';
import { TimelineOverlayExampleComponent, TimelineComponent, TimelinePointComponent } from './examples/timeline-overlay-example.component';

const EXAMPLES = [
  DefaultOverlayExampleComponent,
  TimelineOverlayExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtOverlayModule,
    DtButtonModule,
  ],
  declarations: [
    ...EXAMPLES,
    TimelinePointComponent,
    TimelineComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
  providers: [
    { provide: COMPONENT_EXAMPLES, useValue: EXAMPLES, multi: true },
  ],
})
export class DocsOverlayModule {
}

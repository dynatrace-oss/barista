import { NgModule } from '@angular/core';
import { DefaultOverlayExampleComponent } from './examples/default-overlay-example.component';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtOverlayModule, DtButtonModule } from '@dynatrace/angular-components';
import { TimelineOverlayExampleComponent, TimelineComponent, TimelinePointComponent } from './examples/timeline-overlay-example.component';
import { DummyOverlay, ProgrammaticOverlayExampleComponent } from './examples/programmatic-overlay-example.component';

const EXAMPLES = [
  DefaultOverlayExampleComponent,
  TimelineOverlayExampleComponent,
  ProgrammaticOverlayExampleComponent,
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
    DummyOverlay,
  ],
  entryComponents: [
    ...EXAMPLES,
    DummyOverlay,
  ],
  providers: [
    { provide: COMPONENT_EXAMPLES, useValue: EXAMPLES, multi: true },
  ],
})
export class DocsOverlayModule {
}

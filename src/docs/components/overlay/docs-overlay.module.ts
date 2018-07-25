import { NgModule } from '@angular/core';
import { DefaultOverlayExampleComponent } from './examples/default-overlay-example.component';
import { DocsOverlayComponent } from './docs-overlay.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtOverlayModule } from '@dynatrace/angular-components';
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
  ],
  declarations: [
    ...EXAMPLES,
    TimelinePointComponent,
    TimelineComponent,
    DocsOverlayComponent,
  ],
  exports: [
    DocsOverlayComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsOverlayModule {
}

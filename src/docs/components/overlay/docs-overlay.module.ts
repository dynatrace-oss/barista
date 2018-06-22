import { NgModule } from '@angular/core';
import { DefaultOverlayExampleComponent } from './examples/default-overlay-example.component';
import { DocsOverlayComponent } from './docs-overlay.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtOverlayModule } from '@dynatrace/angular-components';

const EXAMPLES = [
  DefaultOverlayExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtOverlayModule,
  ],
  declarations: [
    ...EXAMPLES,
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

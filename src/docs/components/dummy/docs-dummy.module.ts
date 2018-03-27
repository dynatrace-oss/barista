import { NgModule } from '@angular/core';
import { DummyExampleComponent } from './examples/dummy-example.component';
import { DocsDummyComponent } from './docs-dummy.component';
import { UiModule } from '../../ui/ui.module';
import { DummyModule } from '@dynatrace/angular-components/dummy';

export const DUMMY_EXAMPLES = [
  DummyExampleComponent,
];

@NgModule({
  imports: [
    UiModule,
    DummyModule,
  ],
  declarations: [
    ...DUMMY_EXAMPLES,
    DocsDummyComponent,
  ],
  exports: [
    DocsDummyComponent,
  ],
  entryComponents: [
    ...DUMMY_EXAMPLES,
  ],
})
export class DocsDummyModule {
}

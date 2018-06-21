import { NgModule } from '@angular/core';
import { DefaultTagExampleComponent } from './examples/default-tag-example.component';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtTagModule, DtButtonModule } from '@dynatrace/angular-components';
import {DisabledTagExampleComponent} from './examples/disabled-tag-example.component';
import {KeyTagExampleComponent} from './examples/key-tag-example.component';
import {InteractiveTagExampleComponent} from './examples/interactive-tag-example.component';
import {RouterModule} from '@angular/router';
import {RemovableTagExampleComponent} from './examples/removable-tag-example.component';

export const EXAMPLES = [
  DefaultTagExampleComponent,
  DisabledTagExampleComponent,
  KeyTagExampleComponent,
  InteractiveTagExampleComponent,
  RemovableTagExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule,
    DtButtonModule,
    DtTagModule,
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
export class DocsTagModule {
}

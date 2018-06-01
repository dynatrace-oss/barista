import { NgModule } from '@angular/core';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtButtonModule, DtInputModule, DtThemingModule } from '@dynatrace/angular-components';
import { DocsInputComponent } from './docs-input.component';
import { DefaultInputExample } from './examples/input-default-example';
import { NgModelInputExample } from './examples/input-ng-model-example';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TextareaInputExample } from './examples/input-textarea-example';
import { DisabledReadonlyInputExample } from './examples/input-disabled-readonly-example';
import { DarkInputExample } from './examples/input-dark-example';

const EXAMPLES = [
  DefaultInputExample,
  DisabledReadonlyInputExample,
  NgModelInputExample,
  TextareaInputExample,
  DarkInputExample,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    FormsModule,
    ReactiveFormsModule,
    DtInputModule,
    DtButtonModule,
    DtThemingModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsInputComponent,
  ],
  exports: [
    DocsInputComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsInputModule {
}

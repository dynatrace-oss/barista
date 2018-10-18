import { NgModule } from '@angular/core';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DtInputModule, DtAutocompleteModule, DtFormFieldModule} from '@dynatrace/angular-components';
import {DefaultAutocompleteExample} from './examples/autocomplete-default-example';
import { CustomFilterAutocompleteExample } from './examples/autocomplete-custom-filter';
import { ControlValuesAutocompleteExample } from './examples/autocomplete-control-values';
import { HighlightFirstOptionAutocompleteExample } from './examples/autocomplete-highlight-first-option';
import { AttachDifferentElementAutocompleteExample } from './examples/autocomplete-attach-different-element';
import { GroupsAutocompleteExample } from './examples/autocomplete-groups';

export const EXAMPLES = [
  DefaultAutocompleteExample,
  CustomFilterAutocompleteExample,
  ControlValuesAutocompleteExample,
  HighlightFirstOptionAutocompleteExample,
  AttachDifferentElementAutocompleteExample,
  GroupsAutocompleteExample,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    FormsModule,
    ReactiveFormsModule,
    DtInputModule,
    DtAutocompleteModule,
    DtFormFieldModule,
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
export class DocsAutocompleteModule {
}

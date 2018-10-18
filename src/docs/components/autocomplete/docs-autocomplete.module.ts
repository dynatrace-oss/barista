import { NgModule } from '@angular/core';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import {DtInputModule, DtAutocompleteModule} from '@dynatrace/angular-components';
import {DefaultAutocompleteExample} from './examples/autocomplete-default-example';

export const EXAMPLES = [
  DefaultAutocompleteExample,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtInputModule,
    DtAutocompleteModule,
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

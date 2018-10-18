import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: '<input type="text" dtInput dtAutocomplete>',
})
@OriginalClassName('DefaultAutocompleteExample')
export class DefaultAutocompleteExample {
}

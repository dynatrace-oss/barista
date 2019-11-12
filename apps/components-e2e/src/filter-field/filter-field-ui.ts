// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers deprecation
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component } from '@angular/core';
import { Validators } from '@angular/forms';

import { DtFilterFieldDefaultDataSource } from '@dynatrace/angular-components/filter-field';

const TEST_DATA = {
  autocomplete: [
    {
      name: 'custom normal',
      suggestions: [],
    },
    {
      name: 'custom required',
      suggestions: [],
      validators: [
        { validatorFn: Validators.required, error: 'field is required' },
      ],
    },
    {
      name: 'custom with multiple',
      suggestions: [],
      validators: [
        { validatorFn: Validators.required, error: 'field is required' },
        { validatorFn: Validators.minLength(3), error: 'min 3 characters' },
      ],
    },
  ],
};

@Component({
  selector: 'filter-field-ui',
  templateUrl: './filter-field-ui.html',
})
export class FilterFieldUi {
  _dataSource = new DtFilterFieldDefaultDataSource<any>(TEST_DATA);
}

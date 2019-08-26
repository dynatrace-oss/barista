// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector
import { Validators } from '@angular/forms';

export const TEST_DATA = {
  autocomplete: [
    {
      name: 'AUT',
      distinct: true,
      autocomplete: [
        {
          name: 'Vienna',
        },
        {
          name: 'Linz',
        },
        {
          name: 'custom',
          suggestions: [],
        },
      ],
    },
    {
      name: 'US',
      autocomplete: [
        {
          name: 'Miami',
        },
        {
          name: 'Los Angeles',
        },
        {
          name: 'custom',
          suggestions: [],
        },
      ],
    },
    {
      name: 'DE (async)',
      async: true,
      autocomplete: [],
    },
    {
      name: 'Different Country',
      suggestions: ['IT', 'ES', 'UK'],
      validators: [
        { validatorFn: Validators.required, error: 'is required' },
        {
          validatorFn: Validators.minLength(2),
          error: 'Country code needs at least 2 characters',
        },
      ],
    },
  ],
};

export const TEST_DATA_ASYNC = {
  name: 'DE (async)',
  autocomplete: [
    { name: 'Berlin' },
    {
      name: 'München',
      suggestions: [],
      validators: [{ validatorFn: Validators.required, error: 'is required' }],
    },
  ],
};

import { Component } from '@angular/core';
import { DefaultFormFieldExample } from './examples/form-field-default-example';
import { HintFormFieldExample } from './examples/form-field-hint-example';
import { ErrorFormFieldExample } from './examples/form-field-error-example';
import { PrefixSuffixFormFieldExample } from './examples/form-field-prefix-suffix-example';

@Component({
  moduleId: module.id,
  selector: 'docs-form-field',
  templateUrl: './docs-form-field.html',
})
export class DocsFormField {

  examples = {
    default: DefaultFormFieldExample,
    hint: HintFormFieldExample,
    error: ErrorFormFieldExample,
    prefixSuffix: PrefixSuffixFormFieldExample,
  };
}

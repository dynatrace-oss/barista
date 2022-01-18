/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DtTagAddSubmittedCustomFormEvent } from '@dynatrace/barista-components/tag';

interface Tag {
  key: string;
  value?: string;
}

@Component({
  selector: 'dt-example-custom-add-form-tag',
  templateUrl: './tag-custom-add-form-example.html',
  styleUrls: ['./tag-custom-add-form-example.scss'],
})
export class DtExampleCustomAddFormTag {
  readonly tags = new Set<Tag>([
    { key: '.NetTest' },
    { key: '193.168.4.3:80' },
    { key: 'window', value: 'b00m' },
    { key: 'key', value: 'value' },
  ]);

  keyFormControl = new FormControl('', [
    // eslint-disable-next-line @typescript-eslint/unbound-method
    Validators.required,
  ]);

  valueFormControl = new FormControl('');

  keyValueForm = new FormGroup({
    key: this.keyFormControl,
    value: this.valueFormControl,
  });

  addTag(event: DtTagAddSubmittedCustomFormEvent): void {
    this.tags.add({ key: event.key, value: event.value });
  }
}

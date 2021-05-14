/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface Tag {
  key: string;
  value?: string;
}

@Component({
  selector: 'dt-example-custom-add-form-tag',
  templateUrl: './tag-custom-add-form-example.html',
  styleUrls: ['./tag-custom-add-form-example.scss'],
})
export class DtExampleCustomAddFormTag implements OnInit {
  readonly tags = new Set<Tag>();

  keyFormControl = new FormControl('', [
    // tslint:disable-next-line: no-unbound-method
    Validators.required,
  ]);

  valueFormControl = new FormControl('');

  keyValueForm = new FormGroup({
    key: this.keyFormControl,
    value: this.valueFormControl,
  });

  ngOnInit(): void {
    this.addTag('.NetTest');
    this.addTag('193.168.4.3:80');
    this.addTag('window', '[b00m]');
    this.addTag('deploy', 'my-key');
  }

  addTag(key: string, value?: string): void {
    this.tags.add({ key, value });
  }
}

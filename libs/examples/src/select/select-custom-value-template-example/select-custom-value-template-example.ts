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

@Component({
  selector: 'dt-example-select-custom-value-template-example',
  templateUrl: './select-custom-value-template-example.html',
  styles: [
    'dt-option div, ::ng-deep .dt-select-trigger .dt-select-value { display: flex; align-items: center; }',
    '.dt-select-value-template span, dt-option span { display: flex; height: 15px; width: 15px; margin-right: 5px; border-radius: 2px; }',
  ],
})
export class DtExampleSelectCustomValueTemplate {
  selectedValue: { value: string; viewValue: string };
  colors = [
    { viewValue: 'Red', value: 'red' },
    { viewValue: 'Blue', value: 'blue' },
    { viewValue: 'Green', value: 'green' },
  ];
}

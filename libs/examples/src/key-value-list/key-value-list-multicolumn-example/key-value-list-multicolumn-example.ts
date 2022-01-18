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
  selector: 'dt-example-key-value-list-multicolumn',
  templateUrl: 'key-value-list-multicolumn-example.html',
})
export class DtExampleKeyValueListMulticolumn {
  entries: object[] = [
    { key: 'Temp', value: '28C' },
    { key: 'Temp1', value: '27C' },
    { key: 'Temp2', value: '24C' },
    { key: 'Temp3', value: '29C' },
    { key: 'Temp4', value: '22C' },
    { key: 'Temp5', value: '21C' },
    { key: 'Temp6', value: '25C' },
    { key: 'Temp7', value: '29C' },
    { key: 'Temp8', value: '30C' },
    { key: 'Temp9', value: '22C' },
    { key: 'Temp10', value: '26C' },
    { key: 'Temp11', value: '21C' },
    { key: 'Temp12', value: '32C' },
    { key: 'Temp13', value: '25C' },
    { key: 'Temp14', value: '19C' },
    { key: 'Temp15', value: '24C' },
    { key: 'Temp16', value: '27C' },
    { key: 'Temp17', value: '21C' },
    { key: 'Temp18', value: '28C' },
    { key: 'Temp19', value: '33C' },
    { key: 'Temp20', value: '26C' },
  ];
}

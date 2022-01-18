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

import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'context-dialog-dev-app-demo',
  templateUrl: './context-dialog-demo.component.html',
  styleUrls: ['./context-dialog-demo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContextDialogDemo {
  dataSource: Array<{ host: string; cpu: string }> = [
    { host: 'et-demo-2-win4', cpu: '30 %' },
    { host: 'et-demo-2-win3', cpu: '26 %' },
    { host: 'docker-host2', cpu: '25.4 %' },
    { host: 'et-demo-2-win1', cpu: '23 %' },
  ];

  panel = ['more', 'evenmore'];

  removeRow(row: { host: string; cpu: string }): void {
    this.dataSource = this.dataSource.filter((r) => r !== row);
  }
}

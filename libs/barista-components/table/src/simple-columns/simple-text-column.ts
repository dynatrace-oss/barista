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

import {
  ChangeDetectionStrategy,
  Component,
  Optional,
  ViewEncapsulation,
} from '@angular/core';

import { DtTable } from '../table';
import { DtSimpleColumnBase } from './simple-column-base';

@Component({
  selector: 'dt-simple-text-column',
  templateUrl: 'simple-text-column.html',
  styleUrls: ['./simple-column.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated,
  /*
   * Deliberatley set to Default because the embedded view that gets created for the
   * dtColumDef can't handle onPush and results in ChangeAfterChecked error.
   */
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [{ provide: DtSimpleColumnBase, useExisting: DtSimpleTextColumn }],
})
export class DtSimpleTextColumn<T> extends DtSimpleColumnBase<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(@Optional() table: DtTable<T>) {
    super(table);
  }
}

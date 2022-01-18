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

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import { DtCell } from '../cell';
import { DtExpandableRow } from './expandable-row';

/**
 * Cell template that adds the right classes, role and static content for the details cell,
 * which can be used to indicate that a table row is expandable.
 */
@Component({
  selector: 'dt-expandable-cell',
  templateUrl: './expandable-cell.html',
  styleUrls: ['./expandable-cell.scss'],
  host: {
    class: 'dt-expandable-cell',
    role: 'gridcell',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  exportAs: 'dtExpandableCell',
})
export class DtExpandableCell extends DtCell {
  /**
   * @internal
   * Retyped for the AOT compiler, as _row member will always be a DtExpandableRow
   * for the DtExpandable cell.
   */
  _row: DtExpandableRow;

  /** Aria label applied to the cell for better accessibility. */
  @Input('aria-label') ariaLabel: string;
  /** Aria reference to a label describing the cell. */
  @Input('aria-labelledby') ariaLabelledBy: string;
}

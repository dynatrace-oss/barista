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

import { CdkRow } from '@angular/cdk/table';
import { Component, ElementRef, Input, SkipSelf } from '@angular/core';

import { DtRow } from '@dynatrace/barista-components/table';

import { DtTreeTable } from './tree-table';

@Component({
  selector: 'dt-tree-table-row',
  templateUrl: 'tree-table-row.html',
  host: {
    '[attr.aria-expanded]': '_isExpanded',
    '[attr.aria-level]': '_level + 1',
    role: 'row',
    class: 'dt-tree-table-row',
  },
  styleUrls: ['tree-table-row.scss'],
  providers: [{ provide: CdkRow, useExisting: DtTreeTableRow }],
})
export class DtTreeTableRow<T> extends DtRow {
  /** The data for this row. This needs to be set in order for the tree control to work */
  @Input()
  get data(): T {
    return this._data;
  }
  set data(data: T) {
    this._data = data;
  }

  /** @internal Wether the row is expanded/collapsed */
  get _isExpanded(): boolean {
    return this._treeTable.treeControl.isExpanded(this._data);
  }

  /** @internal The level for the row */
  get _level(): number {
    return this._treeTable.treeControl.getLevel(this._data);
  }

  private _data: T;

  constructor(
    elementRef: ElementRef,
    @SkipSelf() private _treeTable: DtTreeTable<T>,
  ) {
    super(elementRef);
  }
}

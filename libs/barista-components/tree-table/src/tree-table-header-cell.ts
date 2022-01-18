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

import { Component, ElementRef } from '@angular/core';

import {
  DtColumnDef,
  _setDtColumnCssClasses,
} from '@dynatrace/barista-components/table';

@Component({
  selector: 'dt-tree-table-header-cell',
  styleUrls: ['tree-table-header-cell.scss'],
  templateUrl: 'tree-table-header-cell.html',
  host: {
    class: 'dt-tree-table-header-cell',
    role: 'columnheader',
  },
})
export class DtTreeTableHeaderCell {
  constructor(
    private _columnDef: DtColumnDef,
    private _elementRef: ElementRef,
  ) {
    _setDtColumnCssClasses(this._columnDef, this._elementRef);
  }
}

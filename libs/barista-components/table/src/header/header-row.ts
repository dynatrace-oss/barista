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
  CDK_ROW_TEMPLATE,
  CdkHeaderRow,
  CdkHeaderRowDef,
} from '@angular/cdk/table';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Header row definition for the dt-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
  selector: '[dtHeaderRowDef]',
  exportAs: 'dtHeaderRowDef',
  providers: [{ provide: CdkHeaderRowDef, useExisting: DtHeaderRowDef }],
  inputs: ['columns: dtHeaderRowDef', 'sticky: dtHeaderRowDefSticky'],
})
export class DtHeaderRowDef extends CdkHeaderRowDef {}

/** Header template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'dt-header-row',
  template: CDK_ROW_TEMPLATE,
  styleUrls: ['./header-row.scss'],
  host: {
    class: 'dt-header-row',
    role: 'rowheader',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtHeaderRow',
})
export class DtHeaderRow extends CdkHeaderRow {}

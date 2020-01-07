/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import {
  CDK_TABLE_TEMPLATE,
  CdkTable,
  CdkTableModule,
} from '@angular/cdk/table';
import { DOCUMENT } from '@angular/common';
import {
  Attribute,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  IterableDiffers,
  NgModule,
} from '@angular/core';

@Component({
  selector: 'dt-table-base',
  template: CDK_TABLE_TEMPLATE,
})
// tslint:disable-next-line: class-name
export class _DtTableBase<T> extends CdkTable<T> {
  private _interactiveRows = false;

  /** Whether the defined rows are interactive. */
  @Input()
  get interactiveRows(): boolean {
    return this._interactiveRows;
  }
  set interactiveRows(value: boolean) {
    this._interactiveRows = coerceBooleanProperty(value);
  }

  constructor(
    differs: IterableDiffers,
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
    // tslint:disable-next-line: no-any
    @Inject(DOCUMENT) document: any,
    platform: Platform,
    @Attribute('role') protected _role: string,
    @Attribute('interactiveRows') interactiveRows?: boolean,
  ) {
    // tslint:disable-next-line: no-any
    super(
      differs,
      changeDetectorRef,
      elementRef,
      _role,
      (null as unknown) as any, // tslint:disable-line:no-any
      document,
      platform,
    );
    this.interactiveRows = interactiveRows!;
  }
}

@NgModule({
  imports: [CdkTableModule],
  exports: [_DtTableBase],
  declarations: [_DtTableBase],
})
// tslint:disable-next-line: class-name
export class _DtTableBaseModule {}

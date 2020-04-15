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

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Directive,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'dt-combobox',
  templateUrl: 'combobox.html',
  styleUrls: ['combobox.scss'],
  host: {
    class: 'dt-combobox',
  },
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtCombobox',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtCombobox implements AfterViewInit, OnDestroy, OnInit {
  constructor() {
    // private _changeDetectorRef: ChangeDetectorRef,
    // private _zone: NgZone,
    // private _platform: Platform,
  }

  ngOnInit(): void {
    // TODO ChMa: implement
  }

  ngAfterViewInit(): void {
    // TODO ChMa: implement
  }

  ngOnDestroy(): void {
    // TODO ChMa: implement
  }
}

/**
 * An option for the combobox.
 *
 * @example
 *   <dt-combobox [...]>
 *     <dt-combobox-option>value</dt-combobox-option>
 *   </dt-combobox>
 */
@Directive({
  selector: `dt-combobox-option, [dt-combobox-option], [dtComboboxOption]`,
  exportAs: 'dtComboboxOption',
  host: {
    class: 'dt-combobox-option',
  },
})
export class DtComboboxOption {}

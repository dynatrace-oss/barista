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

import { Component, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { DtColors } from '@dynatrace/barista-components/theming';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ba-color',
  templateUrl: 'color.html',
  styleUrls: ['color.scss'],
})
export class BaColor {
  @Input()
  get color(): string {
    return this._colorInput;
  }
  set color(value: string) {
    this._colorInput = value;
    this._colorname = value.toUpperCase().replace('-', '_');
    this._hexcolor = DtColors[this._colorname];
    this._colorname =
      this._colorname.charAt(0) +
      value.slice(1).replace('-', ' ').replace('_', ' ').toLowerCase();
  }

  /** @internal the hex value of the color */
  _hexcolor: string;

  /** @internal name of the color */
  _colorname: string;

  /** @internal whether copying the hex value was successful */
  _copySuccess = false;

  private _colorInput: string;

  constructor(private _clipboard: Clipboard) {}

  /** @internal copy the hex value to the clipboard */
  _copyColorToClipboard(value: string): void {
    const copySucceeded = this._clipboard.copy(value);

    if (copySucceeded) {
      this._copySuccess = true;

      timer(800)
        .pipe(take(1))
        .subscribe(() => {
          this._copySuccess = false;
        });
    }
  }
}

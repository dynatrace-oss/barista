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

import { Component, ElementRef, ViewChild } from '@angular/core';
import { DtOverlay } from '@dynatrace/barista-components/overlay';

@Component({
  selector: 'dt-example-overlay-programmatic-dummy',
  template: 'overlay',
})
export class DtExampleOverlayProgrammaticDummy {}

@Component({
  selector: 'dt-example-overlay-programmatic',
  templateUrl: 'overlay-programmatic-example.html',
})
export class DtExampleOverlayProgrammatic {
  @ViewChild('origin', { static: true }) origin: ElementRef;

  constructor(private _dtOverlay: DtOverlay) {}

  createOverlay(): void {
    this._dtOverlay.create(this.origin, DtExampleOverlayProgrammaticDummy);
  }

  dismiss(): void {
    this._dtOverlay.dismiss();
  }
}

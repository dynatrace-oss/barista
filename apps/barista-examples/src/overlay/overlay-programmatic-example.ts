/**
 * @license
 * Copyright 2019 Dynatrace LLC
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
  selector: 'component-barista-example',
  template: 'overlay',
})
export class DummyOverlay {}

@Component({
  selector: 'component-barista-example',
  template: `
    <button dt-button (click)="createOverlay()">Create overlay</button>
    <button dt-button (click)="dismiss()">Dismiss</button>
    <p><span #origin>An overlay will be created here</span></p>
  `,
})
export class OverlayProgrammaticExample {
  @ViewChild('origin', { static: true }) origin: ElementRef;

  constructor(private _dtOverlay: DtOverlay) {}

  createOverlay(): void {
    this._dtOverlay.create(this.origin, DummyOverlay);
  }

  dismiss(): void {
    this._dtOverlay.dismiss();
  }
}

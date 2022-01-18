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
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { DtOverlay, DtOverlayRef } from '@dynatrace/barista-components/overlay';

@Component({
  selector: 'dt-example-overlay-implicit-context',
  templateUrl: 'overlay-implicit-context-example.html',
})
export class DtExampleOverlayImplicitContext implements OnInit, OnDestroy {
  i = 0;

  @ViewChild('origin', { static: true }) origin: ElementRef;

  @ViewChild('overlay', { static: true, read: TemplateRef })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overlayTemplate: TemplateRef<any>;

  /** Interval reference to clear up the interval on destroy */
  private _interval: number | undefined;

  constructor(
    private _dtOverlay: DtOverlay,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.updateContext();
    }, 1500);
  }

  ngOnDestroy(): void {
    clearInterval(this._interval);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overlayRef: DtOverlayRef<any> | null;

  createOverlay(): void {
    if (!this.overlayRef) {
      this.overlayRef = this._dtOverlay.create(
        this.origin,
        this.overlayTemplate,
        // Initialize the implicit content with an empty object
        // this is required to actually be able to update it later
        { data: { value: this.i }, pinnable: true },
      );
    }
  }

  /** Pin the overlay */
  pinOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.pin(!this.overlayRef.pinned);
    }
  }

  /** Update the context with some arbitrary values. */
  updateContext(): void {
    this.i += 1;
    if (this.overlayRef) {
      this.overlayRef.updateImplicitContext({
        value: this.i,
      });
      this.changeDetectorRef.markForCheck();
    }
  }

  dismiss(): void {
    if (this.overlayRef && !this.overlayRef.pinned) {
      this._dtOverlay.dismiss();
      this.overlayRef = null;
    }
  }
}

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

import { OverlayRef } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';

import { DtChartSelectionAreaContainer } from './selection-area-container';
import { TemplatePortal, ComponentPortal } from '@angular/cdk/portal';

export class DtChartSelectionAreaOverlayRef {
  /** The ref of the selection area overlay */
  overlayRef: OverlayRef;

  /** Container reference of the selection area overlay */
  containerRef: DtChartSelectionAreaContainer;

  /** Component portal reference of the selection area overlay */
  portal: ComponentPortal<DtChartSelectionAreaContainer>;

  /** Template portal reference to pass to the component portal */
  templatePortal: TemplatePortal<any>;

  constructor(
    overlayRef: OverlayRef,
    containerRef: DtChartSelectionAreaContainer,
    portal: ComponentPortal<DtChartSelectionAreaContainer>,
    // tslint:disable-next-line:no-any
    templatePortal: TemplatePortal<any>,
  ) {
    this.overlayRef = overlayRef;
    this.containerRef = containerRef;
    this.portal = portal;
    this.templatePortal = templatePortal;
  }

  /** Observable that emits when the overlay has finished the enter animation */
  afterOpened(): Observable<void> {
    return this.containerRef._onEnter;
  }

  /** Observable that emits when the overlay has finished the leave animation */
  afterClosed(): Observable<void> {
    return this.containerRef._onLeaveDone;
  }

  /** Start overlay enter animation */
  enter(): void {
    this.containerRef.enter();
  }

  /** Start overlay exit animation */
  exit(): void {
    this.containerRef.exit();
  }
}

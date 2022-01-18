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

import { Component, ViewChild, ElementRef, Inject } from '@angular/core';

import { DtOverlayConfig } from '@dynatrace/barista-components/overlay';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'dt-example-overlay-fullscreen',
  templateUrl: 'overlay-fullscreen-example.html',
  styleUrls: ['./overlay-fullscreen-example.scss'],
})
export class DtExampleOverlayFullscreen {
  config: DtOverlayConfig = {
    pinnable: true,
    originY: 'center',
  };

  @ViewChild('container', { static: true }) container: ElementRef;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  async requestFullscreen(): Promise<void> {
    try {
      const element = this.container.nativeElement;
      const _document = this.document as any;

      if (_document.fullscreenEnabled) {
        await element.requestFullscreen();
      } else if (_document.webkitFullscreenEnabled) {
        await element.webkitRequestFullscreen();
      } else if (_document.mozFullScreenEnabled) {
        await element.mozRequestFullScreen();
      } else if (_document.msFullscreenEnabled) {
        await element.msRequestFullScreen();
      }
    } catch (error) {
      console.error(error);
    }
  }
}

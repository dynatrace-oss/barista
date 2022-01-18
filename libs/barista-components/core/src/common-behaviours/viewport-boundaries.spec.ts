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

import { ViewportRuler } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { NgZone } from '@angular/core';
import { inject } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { MockNgZone } from '@dynatrace/testing/browser';
import { DtDefaultViewportResizer, DtViewportResizer } from '../viewport';
import { mixinViewportBoundaries } from './viewport-boundaries';

let document: Document;

describe('MixinViewportBoundaries', () => {
  beforeEach(() => {
    inject([DOCUMENT], (doc: Document) => {
      document = doc;
    });
  });

  it('should augment an existing class with a _viewportBoundaries$ property', () => {
    const classWithDisabled = mixinViewportBoundaries(TestClass);
    const instance = new classWithDisabled();

    // Expected the mixed-into class to have a _viewportBoundaries property
    expect(instance).toHaveProperty('_viewportBoundaries$');
  });

  it('should augment an existing class with a _destroy$ property', () => {
    const classWithDisabled = mixinViewportBoundaries(TestClass);
    const instance = new classWithDisabled();

    // Expected the mixed-into class to have a _viewportBoundaries property
    expect(instance).toHaveProperty('_destroy$');
  });
});

class TestClass {
  _platform = new Platform('testid');
  _zone: NgZone = new MockNgZone();
  _viewportRuler = new ViewportRuler(this._platform, this._zone, document);
  /** Fake instance of an DtViewportResizer. */
  _viewportResizer: DtViewportResizer = new DtDefaultViewportResizer(
    this._viewportRuler,
  );
}

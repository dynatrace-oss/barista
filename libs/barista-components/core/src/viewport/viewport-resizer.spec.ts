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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  TestBed,
  waitForAsync,
  fakeAsync,
  inject,
  tick,
} from '@angular/core/testing';

import { DtViewportResizer } from './viewport-resizer';

function createFakeEvent(type: string): Event {
  const event = document.createEvent('Event');
  event.initEvent(type, true, true);

  return event;
}

describe('DefaultViewportResizer', () => {
  let resizer: DtViewportResizer;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [ViewportRuler, Platform],
      });
    }),
  );

  beforeEach(inject(
    [DtViewportResizer],
    (viewportResizer: DtViewportResizer) => {
      resizer = viewportResizer;
    },
  ));

  it('should emit on resize', fakeAsync(() => {
    const spy = jest.fn();
    const subscription = resizer.change().subscribe(spy);

    window.dispatchEvent(createFakeEvent('resize'));
    tick(150);
    expect(spy).toHaveBeenCalled();
    subscription.unsubscribe();
  }));
});

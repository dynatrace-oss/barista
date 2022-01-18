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

/** Mocks the intersection observer and provides utility functions to mock the intersecting values of observed elements */
export class MockIntersectionObserver {
  private _observerMap = new Map();
  private _instanceMap = new Map();

  constructor() {
    // Needs to be any since we cannot access the global jest namespace otherwise
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).IntersectionObserver = jest.fn((cb, options) => {
      const instance = {
        thresholds: Array.isArray(options.threshold)
          ? options.threshold
          : [options.threshold],
        root: options.root,
        rootMargin: options.rootMargin,
        observe: jest.fn((element: Element) => {
          this._instanceMap.set(element, instance);
          this._observerMap.set(element, cb);
        }),
        unobserve: jest.fn((element: Element) => {
          this._instanceMap.delete(element);
          this._observerMap.delete(element);
        }),
        disconnect: jest.fn(),
      };
      return instance;
    });
  }

  /** Sets the intersecting value for all observed elements */
  mockAllIsIntersecting(isIntersecting: boolean): void {
    this._observerMap.forEach((_, element) => {
      this.mockIsIntersecting(element, isIntersecting);
    });
  }

  /** Sets the intersecting value for one of the observed elements */
  mockIsIntersecting(element: Element, isIntersecting: boolean): void {
    const cb = this._observerMap.get(element);
    if (cb) {
      const entry = [
        {
          isIntersecting,
          target: element,
          intersectionRatio: isIntersecting ? 1 : 0,
        },
      ];
      cb(entry);
    } else {
      throw new Error(
        'No IntersectionObserver instance found for element. Is it still mounted in the DOM?',
      );
    }
  }

  /** Clears the mock */
  clearMock(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).IntersectionObserver.mockClear();
    this._instanceMap.clear();
    this._observerMap.clear();
  }
}

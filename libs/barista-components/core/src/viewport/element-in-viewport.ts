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

import { coerceElement } from '@angular/cdk/coercion';
import { ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, flatMap, map } from 'rxjs/operators';

/** Creates a cold stream that emits whenever the intersection of the element changes */
export function createInViewportStream(
  element: ElementRef | Element,
  threshold: number | number[] = 1,
): Observable<boolean> {
  // eslint-disable-next-line
  return typeof window !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as Window & { IntersectionObserver: any }).IntersectionObserver
    ? new Observable<IntersectionObserverEntry[]>((observer) => {
        const intersectionObserver = new IntersectionObserver(
          (entries) => {
            observer.next(entries);
          },
          { threshold },
        );
        intersectionObserver.observe(coerceElement(element));
        return () => {
          intersectionObserver.disconnect();
        };
      }).pipe(
        flatMap((entries) => entries),
        map((entry) => entry.isIntersecting),
        distinctUntilChanged(),
      )
    : of(true);
}

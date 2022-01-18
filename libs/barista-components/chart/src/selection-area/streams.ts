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

import { ElementRef, NgZone, QueryList } from '@angular/core';
import { isEqual } from 'lodash-es';
import {
  Observable,
  SchedulerLike,
  Subject,
  animationFrameScheduler,
  combineLatest,
  fromEvent,
  merge,
  of,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  observeOn,
  pairwise,
  share,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';

import {
  _addCssClass,
  _removeCssClass,
  runInsideZone,
} from '@dynatrace/barista-components/core';

import {
  captureAndMergeEvents,
  getElementRef,
  getRelativeMousePosition,
} from '../utils';
import { NO_POINTER_EVENTS_CLASS } from './constants';
import {
  DtSelectionAreaEventTarget,
  calculatePosition,
} from './position-utils';

/**
 * Creates a Mousedown stream on the provided elements and removes the pointer events class
 *
 * @param target The HTMLElement that should used to calculate the relative position
 * @param mousedownElements Array of Elements that is used as event targets
 * to capture the mouse move event
 */
export function getMouseDownStream(
  target: HTMLElement,
  mousedownElements: Element[],
): Observable<MouseEvent> {
  return captureAndMergeEvents('mousedown', mousedownElements).pipe(
    filter((event) => event.button === 0), // only emit left mouse
    tap(() => {
      _removeCssClass(target, NO_POINTER_EVENTS_CLASS);
    }),
    share(),
  );
}

/**
 * Creates a Mouseup stream on the Window. Used to end other streams and actions.
 * In case it is used to end our actions we want to dispatch a side effect that adds the pointer
 * events back on the target. Starting actions remove the pointer events class.
 *
 * @param target The HTMLElement where the no pointer events class should be toggled.
 * @param mouseUpStream$ Optional stream that emits the start
 */
export function getMouseUpStream(
  target: HTMLElement,
  mouseUpStream$?: Observable<MouseEvent>,
): Observable<MouseEvent> {
  const mouseUp$ = mouseUpStream$
    ? mouseUpStream$
    : fromEvent<MouseEvent>(window, 'mouseup');

  return mouseUp$.pipe(
    tap(() => {
      _addCssClass(target, NO_POINTER_EVENTS_CLASS);
    }),
    share(),
  );
}

/**
 * Creates a touch start stream on the provided elements and removes the pointer events class
 *
 * @param target The HTMLElement where the class should be toggled
 * @param mousedownElements Array of elements that is used as event targets
 * to capture the mouse move event
 */
export function getTouchStartStream(
  target: HTMLElement,
  mousedownElements: Element[],
): Observable<TouchEvent> {
  return captureAndMergeEvents('touchstart', mousedownElements).pipe(
    tap(() => {
      _removeCssClass(target, NO_POINTER_EVENTS_CLASS);
    }),
    share(),
  );
}

/**
 * Creates a touch end stream on the window. Used to end other streams and actions.
 * In case it is used to end our actions we want to dispatch a side effect that adds the pointer
 * events back on the target. Starting actions remove the pointer events class.
 *
 * @param target The HTMLElement where the no pointer events class should be toggled.
 * @param touchEnd$ A stream that emits a touch end event
 */
export function getTouchEndStream(
  target: HTMLElement,
  touchEnd$?: Observable<TouchEvent>,
): Observable<TouchEvent> {
  const touchEndStream$ = touchEnd$
    ? touchEnd$
    : fromEvent<TouchEvent>(window, 'touchend', { passive: true });

  return touchEndStream$.pipe(
    tap(() => {
      _addCssClass(target, NO_POINTER_EVENTS_CLASS);
    }),
    share(),
  );
}

/**
 * Creates a mouse out stream on the provided elements filters out the mouse out between the elements
 * if the event is not outside the provided bounding client rect.
 *
 * @param target The HTMLElement that should used to calculate the relative position
 * @param mousedownElements Array of Elements that is used as event targets
 * to capture the mouse out event
 * @param targetBCR the bounding client rect of the target that is used to identify if the mouseout is correct.
 */
export function getMouseOutStream(
  target: HTMLElement,
  mousedownElements: Element[],
  targetBCR: ClientRect,
): Observable<{ x: number; y: number }> {
  return captureAndMergeEvents('mouseout', mousedownElements).pipe(
    map((event: MouseEvent) => getRelativeMousePosition(event, target)),
    filter(
      (position) =>
        position.x < 0 ||
        position.y < 0 ||
        position.x > targetBCR.width ||
        position.y > targetBCR.height,
    ),
  );
}

/**
 * Creates a stream that provides relative position for a click. We have to check if it is not only
 * a click in case we have to separate from a drag as well.
 *
 * @param target The HTMLElement that should used to calculate the relative position
 * And capture the move events so that we can check if it is not a drag
 * @param clickStart$ A mousedown stream that indicates a click
 * @param clickEnd$ A mouseup stream that ends a click
 * @param dragMove$ A stream that emits a move event
 */
export function getClickStream(
  target: HTMLElement,
  clickStart$: Observable<MouseEvent>,
  clickEnd$: Observable<MouseEvent>,
  dragMove$?: Observable<MouseEvent>,
): Observable<{ x: number; y: number }> {
  const drag$ = dragMove$
    ? dragMove$
    : fromEvent<MouseEvent>(target, 'mousemove');

  return merge(clickStart$, drag$, clickEnd$).pipe(
    pairwise(),
    filter(([a, b]) => a.type === 'mousedown' && b.type === 'mouseup'),
    map(([b]) => b),
    map((event: MouseEvent) => getRelativeMousePosition(event, target)),
    share(),
  );
}

/**
 * Creates a stream that provides relative position for a click.
 * It is the similar function like the `getClickStream` only optimized for touch support
 *
 * @param target The HTMLElement that should used to calculate the relative position
 * And capture the move events so that we can check if it is not a drag
 * @param touchStart$ A touch start stream that indicates a click
 * @param touchEnd$  A touch end stream that indicates a click
 * @param touchMove$ A stream that emits a move event
 */
export function getTouchStream(
  target: HTMLElement,
  touchStart$: Observable<TouchEvent>,
  touchEnd$: Observable<TouchEvent>,
  touchMove$?: Observable<TouchEvent>,
): Observable<{ x: number; y: number }> {
  const touch$ = touchMove$
    ? touchMove$
    : fromEvent<TouchEvent>(target, 'touchmove', { passive: true });
  return merge(touchStart$, touch$, touchEnd$).pipe(
    pairwise(),
    filter(([a, b]) => a.type === 'touchstart' && b.type === 'touchend'),
    map(([b]) => b),
    map((event: TouchEvent) => getRelativeMousePosition(event, target)),
    share(),
  );
}

/**
 * Creates a Stream that emits a touch move on one to n event targets.
 * Uses the animationFrameScheduler to throttle the move by default.
 *
 * @param mousedownElements Array of Elements that is used as event targets
 * to capture the mouse move event
 * @param scheduler A scheduler to throttle the mouse move per default the
 * animationFrameScheduler will be taken.
 */
export function getTouchMove(
  mousedownElements: Element[],
  scheduler?: SchedulerLike,
): Observable<TouchEvent> {
  return captureAndMergeEvents('touchmove', mousedownElements).pipe(
    observeOn(scheduler || animationFrameScheduler),
    share(),
  );
}

/**
 * Creates a Stream that emits a mouse move on one to n event targets.
 * Uses the animationFrameScheduler to throttle the move by default.
 *
 * @param target The HTMLElement that should used to calculate the relative position
 * @param mousedownElements Array of Elements that is used as event targets
 * to capture the mouse move event
 * @param scheduler A scheduler to throttle the mouse move per default the
 * animationFrameScheduler will be taken.
 */
export function getMouseMove(
  target: HTMLElement,
  mousedownElements: Element[],
  scheduler?: SchedulerLike,
): Observable<{ x: number; y: number }> {
  return captureAndMergeEvents('mousemove', mousedownElements).pipe(
    observeOn(scheduler || animationFrameScheduler),
    map((event: MouseEvent) => getRelativeMousePosition(event, target)),
    share(),
  );
}

/**
 * Creates a Stream that emits a drag on a provided element.
 *
 * @param target The HTMLElement that should used to calculate the relative position
 * @param dragStart$ Any Stream that emits the start of the drag. (mostly a mousedown or touchstart)
 * @param dragEnd$  The Stream that triggers the end of a drag. (mostly a mouseup or touchend)
 * @param dragMove$ The stream that fires the moves – by default a mousemove on the window.
 * @param scheduler A scheduler that throttles the drag – by default the `animationFrameScheduler` is used
 */
export function getDragStream(
  target: HTMLElement,
  dragStart$: Observable<unknown>,
  dragEnd$: Observable<MouseEvent | TouchEvent>,
  dragMove$?: Observable<MouseEvent | TouchEvent>,
  scheduler?: SchedulerLike,
): Observable<{ x: number; y: number }> {
  const drag$ = dragMove$
    ? dragMove$
    : fromEvent<MouseEvent>(window, 'mousemove');
  return dragStart$.pipe(
    switchMap(() => drag$.pipe(takeUntil(dragEnd$.pipe(take(1))))),
    observeOn(scheduler || animationFrameScheduler),
    map((event: MouseEvent | TouchEvent) =>
      getRelativeMousePosition(event, target),
    ),
    distinctUntilChanged(isEqual),
    share(),
  );
}

/**
 * Creates a stream that gathers the first ElementRef from a query list every time the
 * provided changes stream fires and the zone has no micro tasks anymore.
 *
 * @param changes$ The stream that is used for re-querying the new ElementRef.
 * @param destroy$ A Stream that is responsible for completing this stream.
 * @param queryList The QueryList wit the HTMLElement to look for.
 * @param zone Instance of the NgZone-
 */
export function getElementRefStream<T>(
  changes$: Observable<unknown>,
  destroy$: Subject<void>,
  queryList: QueryList<ElementRef<T>>,
  zone: NgZone,
): Observable<ElementRef<T>> {
  return changes$.pipe(
    observeOn(runInsideZone(zone)),
    switchMap(() =>
      zone.hasPendingMicrotasks
        ? zone.onMicrotaskEmpty.pipe(take(1))
        : of(null),
    ),
    // take until needs to be before getElementRef in case that this custom operator uses a filter
    takeUntil(destroy$),
    getElementRef<T>(queryList),
  );
}

/**
 * Creates a stream that creates a range out of a start and move stream.
 *
 * @param dragStart$ The stream that emits the start of creating a range.
 * @param dragMove$ The event that provides the updated coordinates of the range.
 * @param targetWidth The width of the target where the selection area is drawn.
 */
export function getRangeCreateStream(
  dragStart$: Observable<{ x: number; y: number }>,
  dragMove$: Observable<{ x: number; y: number }>,
  targetWidth: number,
): Observable<{ left: number; width: number }> {
  return dragStart$.pipe(
    observeOn(animationFrameScheduler),
    switchMap((start) => dragMove$.pipe(map((move) => [start, move]))),
    map(([startPosition, endPosition]) =>
      calculatePosition(
        DtSelectionAreaEventTarget.Origin,
        endPosition.x - startPosition.x,
        startPosition.x,
        0,
        targetWidth,
      ),
    ),
    distinctUntilChanged(isEqual),
  );
}

/**
 * Creates a stream that listens for resizing of an existing range.
 * Important notice: if the existing selection area is in a disabled state it can only grow and not shrink in width.
 *
 * @param dragMove$ The stream that emits the current position of the resize.
 * @param dragOrigin$ The origin that triggers the resize of the range
 * @param previousArea The old area that should be updated with the move
 * @param targetWidth The width of the target where the selection area is drawn.
 * @param isRangeValid Function that checks if the range is valid.
 * @param getRangeValuesFromPixels  Function that converts the left and width from a range to a start end end value
 */
export function getRangeResizeStream(
  dragMove$: Observable<{ x: number; y: number }>,
  dragOrigin$: Observable<DtSelectionAreaEventTarget>,
  targetWidth: number,
  previousArea: () => { left: number; width: number },
  isRangeValid: (start: number, end: number) => boolean,
  getRangeValuesFromPixels: (
    left: number,
    width: number,
  ) => [number, number] | undefined,
): Observable<{ left: number; width: number }> {
  return combineLatest([dragMove$, dragOrigin$]).pipe(
    observeOn(animationFrameScheduler),
    map(([position, handle]) => [position, handle, previousArea()]),
    map(
      ([position, handle, range]: [
        { x: number; y: number },
        DtSelectionAreaEventTarget,
        { left: number; width: number },
      ]) => {
        const delta =
          handle === DtSelectionAreaEventTarget.RightHandle
            ? position.x - (range.left + range.width)
            : position.x - range.left;

        const next = calculatePosition(
          handle,
          delta,
          range.left,
          range.width,
          targetWidth,
        );

        return {
          cur: range,
          next,
        };
      },
    ),
    distinctUntilChanged(isEqual),
    filter(({ cur, next }) => {
      // on resize the range can only be dragged in a way that it meets the minimum and maximum constraints
      // when the range is disabled it can be only dragged to be greater than the disabled range so to
      // break out the disabled state. Once it is not disabled anymore it is not possible to get disabled.
      const values = getRangeValuesFromPixels(next.left, next.width);
      const disabled = values && !isRangeValid(values[0], values[1]);

      if (!disabled || (disabled && next.width > cur.width)) {
        return true;
      }
      return false;
    }),
    map(({ next }) => next),
  );
}

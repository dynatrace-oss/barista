import { ElementRef, NgZone, QueryList } from '@angular/core';
import {
  addCssClass,
  removeCssClass,
} from '@dynatrace/angular-components/core';
import { isEqual } from 'lodash';
import {
  animationFrameScheduler,
  combineLatest,
  fromEvent,
  merge,
  Observable,
  SchedulerLike,
  Subject,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  share,
  switchMap,
  take,
  takeUntil,
  tap,
  throttleTime,
} from 'rxjs/operators';
import {
  captureAndMergeEvents,
  getElementRef,
  getRelativeMousePosition,
} from '../utils';
import { NO_POINTER_EVENTS_CLASS } from './constants';
import {
  calculatePosition,
  DtSelectionAreaEventTarget,
} from './position-utils';

/**
 * Creates a Mousedown stream on the provided elements and removes the pointer events class
 * @param target The HTMLElement that should used to calculate the relative position
 * @param mousedownElements Array of Elements that is used as event targets
 * to capture the mouse move event
 */
export function getMouseDownStream(
  target: HTMLElement,
  mousedownElements: Element[]
): Observable<MouseEvent> {
  return captureAndMergeEvents('mousedown', mousedownElements).pipe(
    filter((event) => event.button === 0), // only emit left mouse
    tap(() => {
      removeCssClass(target, NO_POINTER_EVENTS_CLASS);
    }),
    share()
  );
}

/**
 * Creates a Mouseup stream on the Window. Used to end other streams and actions.
 * In case it is used to end our actions we want to dispatch a side effect that adds the pointer
 * events back on the target. Starting actions remove the pointer events class.
 * @param target The HTMLElement where the no pointer events class should be toggled.
 */
export function getMouseUpStream(target: HTMLElement): Observable<MouseEvent> {
  return fromEvent<MouseEvent>(window, 'mouseup').pipe(
    tap(() => {
      addCssClass(target, NO_POINTER_EVENTS_CLASS);
    }),
    share()
  );
}

/**
 * Creates a stream that provides relative position for a click. We have to check if it is not only
 * a click in case we have to separate from a drag as well.
 * @param target The HTMLElement that should used to calculate the relative position
 * And capture the move events so that we can check if it is not a drag
 * @param clickStart$ A mousedown stream that indicates a click
 * @param clickEnd$ A mouseup stream that ends a click
 */
export function getClickStream(
  target: HTMLElement,
  clickStart$: Observable<MouseEvent>,
  clickEnd$: Observable<MouseEvent>
): Observable<{ x: number; y: number }> {
  return merge(
    clickStart$,
    fromEvent<MouseEvent>(target, 'mousemove'),
    clickEnd$
  ).pipe(
    pairwise(),
    filter(([a, b]) => a.type === 'mousedown' && b.type === 'mouseup'),
    map(([b]) => b),
    map((event: MouseEvent) => getRelativeMousePosition(event, target)),
    share()
  );
}

/**
 * Creates a Stream that emits a mouse move on one to n event targets.
 * Uses the animationFrameScheduler to throttle the move by default.
 * @param target The HTMLElement that should used to calculate the relative position
 * @param mousedownElements Array of Elements that is used as event targets
 * to capture the mouse move event
 * @param scheduler A scheduler to throttle the mouse move per default the
 * animationFrameScheduler will be taken.
 */
export function getMouseMove(
  target: HTMLElement,
  mousedownElements: Element[],
  scheduler?: SchedulerLike | undefined
): Observable<{ x: number; y: number }> {
  return captureAndMergeEvents('mousemove', mousedownElements).pipe(
    throttleTime(0, scheduler || animationFrameScheduler),
    map((event: MouseEvent) => getRelativeMousePosition(event, target)),
    share()
  );
}

/**
 * A factory function that creates a mousemove event on the window.
 * Returns a stream of MouseEvents
 */
export const getWindowMouseMoveStream: () => Observable<MouseEvent> = () =>
  fromEvent<MouseEvent>(window, 'mousemove');

/**
 * Creates a Stream that emits a drag on a provided element.
 * @param target The HTMLElement that should used to calculate the relative position
 * @param dragStart$ Any Stream that emits the start of the drag. (mostly a mousedown)
 * @param dragEnd$  The Stream that triggers the end of a drag. (mostly a mouseup)
 * @param dragMove The stream that fires the moves – by default a mousemove on the window.
 */
export function getDragStream(
  target: HTMLElement,
  dragStart$: Observable<unknown>,
  dragEnd$: Observable<MouseEvent>,
  dragMove?: (() => Observable<MouseEvent>) | undefined,
  scheduler?: SchedulerLike | undefined
): Observable<{ x: number; y: number }> {
  return dragStart$.pipe(
    switchMap(() =>
      (dragMove || getWindowMouseMoveStream)().pipe(
        takeUntil(dragEnd$.pipe(take(1)))
      )
    ),
    throttleTime(0, scheduler || animationFrameScheduler),
    map((event: MouseEvent) => getRelativeMousePosition(event, target)),
    share()
  );
}

/**
 * Creates a stream that gathers the first ElementRef from a query list every time the
 * provided changes stream fires and the zone has no micro tasks anymore.
 * @param changes$ The stream that is used for re-querying the new ElementRef.
 * @param destroy$ A Stream that is responsible for completing this stream.
 * @param queryList The QueryList wit the HTMLElement to look for.
 * @param zone Instance of the NgZone-
 */
export function getElementRefStream<T>(
  changes$: Observable<unknown>,
  destroy$: Subject<void>,
  queryList: QueryList<ElementRef<T>>,
  zone: NgZone
): Observable<ElementRef<T>> {
  return changes$.pipe(
    switchMap(() => zone.onMicrotaskEmpty.pipe(take(1))),
    // take until needs to be before getElementRef in case that this custom operator uses a filter
    takeUntil(destroy$),
    getElementRef<T>(queryList)
  );
}

/**
 * Creates a stream that creates a range out of a start and move stream.
 * @param dragStart$ The stream that emits the start of creating a range.
 * @param dragMove$ The event that provides the updated coordinates of the range.
 * @param targetWidth The width of the target where the selection area is drawn.
 */
export function getRangeCreateStream(
  dragStart$: Observable<{ x: number; y: number }>,
  dragMove$: Observable<{ x: number; y: number }>,
  targetWidth: number
): Observable<{ left: number; width: number }> {
  return combineLatest([dragStart$, dragMove$]).pipe(
    throttleTime(0, animationFrameScheduler),
    map(([startPosition, endPosition]) =>
      calculatePosition(
        DtSelectionAreaEventTarget.Origin,
        endPosition.x - startPosition.x,
        startPosition.x,
        0,
        targetWidth
      )
    ),
    distinctUntilChanged(isEqual)
  );
}

/**
 * Creates a stream that listens for resizing of an existing range.
 * Important notice: if the existing selection area is in a disabled state it can only grow and not shrink in width.
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
    width: number
  ) => [number, number] | undefined
): Observable<{ left: number; width: number }> {
  return combineLatest([dragMove$, dragOrigin$]).pipe(
    throttleTime(0, animationFrameScheduler),
    map(([position, handle]) => [position, handle, previousArea()]),
    map(
      ([position, handle, range]: [
        { x: number; y: number },
        DtSelectionAreaEventTarget,
        { left: number; width: number }
      ]) => {
        const delta =
          handle === 'right'
            ? position.x - (range.left + range.width)
            : position.x - range.left;

        const next = calculatePosition(
          handle,
          delta,
          range.left,
          range.width,
          targetWidth
        );

        return {
          cur: range,
          next,
        };
      }
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
    map(({ next }) => next)
  );
}

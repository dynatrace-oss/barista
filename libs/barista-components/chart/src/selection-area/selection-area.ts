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

import { ENTER } from '@angular/cdk/keycodes';
import {
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayRef,
  ViewportRuler,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  SkipSelf,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  ChangeDetectorRef,
} from '@angular/core';
import {
  _addCssClass,
  DtFlexibleConnectedPositionStrategy,
  DtViewportResizer,
  _getElementBoundingClientRect,
  _readKeyCode,
  _removeCssClass,
  ViewportBoundaries,
  mixinViewportBoundaries,
  Constructor,
} from '@dynatrace/barista-components/core';
import {
  animationFrameScheduler,
  combineLatest,
  EMPTY,
  fromEvent,
  merge,
  Observable,
} from 'rxjs';
import {
  concatMapTo,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  share,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
  throttleTime,
  withLatestFrom,
} from 'rxjs/operators';
import { DtChartBase } from '../chart-base';
import { clampRange } from '../range/clamp-range';
import { DtChartRange, RangeStateChangedEvent } from '../range/range';
import {
  DtChartTimestamp,
  TimestampStateChangedEvent,
} from '../timestamp/timestamp';
import {
  captureAndMergeEvents,
  getElementRef,
  getRelativeMousePosition,
  setPosition,
} from '../utils';
import {
  DT_SELECTION_AREA_OVERLAY_POSITIONS,
  GRAB_CURSOR_CLASS,
  HIGHCHARTS_SERIES_GROUP,
  HIGHCHARTS_X_AXIS_GRID,
  HIGHCHARTS_Y_AXIS_GRID,
  NO_POINTER_EVENTS_CLASS,
} from './constants';
import {
  getClickStream,
  getDragStream,
  getElementRefStream,
  getMouseDownStream,
  getMouseMove,
  getMouseOutStream,
  getMouseUpStream,
  getRangeCreateStream,
  getRangeResizeStream,
  getTouchEndStream,
  getTouchMove,
  getTouchStartStream,
  getTouchStream,
} from './streams';

// Boilerplate for applying mixins to DtChartSelectionArea.
export class DtChartSelectionAreaBase {
  constructor(public _viewportResizer: DtViewportResizer) {}
}
export const _DtChartSelectionAreaMixinBase = mixinViewportBoundaries<
  Constructor<DtChartSelectionAreaBase>
>(DtChartSelectionAreaBase);

@Component({
  selector: 'dt-chart-selection-area',
  templateUrl: 'selection-area.html',
  styleUrls: ['selection-area.scss'],
  // Disable view encapsulation to style the overlay content that is located outside this component
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dt-chart-selection-area dt-no-pointer-events',
    '[attr.tabindex]': '0',
  },
})
export class DtChartSelectionArea
  extends _DtChartSelectionAreaMixinBase
  implements AfterContentInit, OnDestroy
{
  /** @internal The timestamp that follows the mouse */
  @ViewChild('hairline', { static: true })
  _hairline: ElementRef<HTMLDivElement>;

  /** mousedown event stream on the selection area emits only left mouse */
  private _mousedown$: Observable<MouseEvent> = EMPTY;

  /** mouse up stream on the window */
  private _mouseup$: Observable<MouseEvent> = EMPTY;

  /** drag event based on a left click on the selection area */
  private _drag$: Observable<{ x: number; y: number }> = EMPTY;

  /** drag event triggered by a boundary drag-resize *(only available within a range)* */
  private _dragHandle$: Observable<{ x: number; y: number }> = EMPTY;

  /** click event stream that emits only click events on the selection area */
  private _click$: Observable<{ x: number; y: number }> = EMPTY;

  /** The ref of the selection area overlay */
  private _overlayRef: OverlayRef | null;

  /** Template portal of the selection area overlay */
  private _portal: TemplatePortal | null;

  /**
   * Stream of Highcharts plotBackground is used to size the selection area according to this area
   * is set after Highcharts render is completed.
   */
  private _plotBackground$: Observable<SVGRectElement> = EMPTY;

  /**
   * Stream that holds an Array of Elements where we capture events,
   * in case that we disable pointer events on selection Area
   */
  private _mouseDownElements$: Observable<Element[]> = EMPTY;

  /** Stream that holds the Bounding Client Rect of the selection area. set after Highcharts render */
  private _selectionAreaBcr$: Observable<ClientRect> = EMPTY;

  constructor(
    @SkipSelf() private _chart: DtChartBase,
    private _elementRef: ElementRef<HTMLElement>,
    private _overlay: Overlay,
    private _zone: NgZone,
    private _viewportRuler: ViewportRuler,
    private _platform: Platform,
    private _overlayContainer: OverlayContainer,
    private _changeDetectorRef: ChangeDetectorRef,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(DOCUMENT) private _document: any,
    public _viewportResizer: DtViewportResizer,
  ) {
    super(_viewportResizer);
  }

  ngAfterContentInit(): void {
    this._plotBackground$ = this._chart._afterRender.asObservable().pipe(
      concatMapTo(this._chart._plotBackground$),
      // plot background can be null as well
      filter<SVGRectElement>(Boolean),
      share(),
    );

    this._mouseDownElements$ = this._plotBackground$.pipe(
      map((plotBackground) => [
        plotBackground,
        ...this._getHighchartsSeriesGroupAndAxis(),
      ]),
      share(),
    );

    // get the BCR of the selection Area
    this._selectionAreaBcr$ = this._plotBackground$.pipe(
      map((plotBackground) => _getElementBoundingClientRect(plotBackground)),
      share(),
    );

    // Listen for enter keypress on the focused selection area to create an
    // initial selection area.´
    fromEvent<KeyboardEvent>(this._elementRef.nativeElement, 'keydown')
      .pipe(
        filter((event) => _readKeyCode(event) === ENTER),
        withLatestFrom(this._selectionAreaBcr$),
        takeUntil(this._destroy$),
      )
      .subscribe(([_event, bcr]) => {
        this._createSelection(bcr);
      });

    this._plotBackground$
      .pipe(takeUntil(this._destroy$))
      .subscribe((plotBackground) => {
        const range = this._chart._range;
        const timestamp = this._chart._timestamp;

        // set the toPixels method on the timestamp and range to calculate a px value for an
        // value on the xAxis alongside with the toValue function.
        if (this._chart._chartObject) {
          const xAxis = this._chart._chartObject.xAxis[0];

          if (timestamp) {
            timestamp._valueToPixels = xAxis.toPixels.bind(xAxis);
            timestamp._pixelsToValue = xAxis.toValue.bind(xAxis);
            timestamp._maxValue = xAxis.max;
            timestamp._minValue = xAxis.min;
          }

          if (range) {
            range._valueToPixels = xAxis.toPixels.bind(xAxis);
            range._pixelsToValue = xAxis.toValue.bind(xAxis);
            range._maxValue = xAxis.max;
            range._minValue = xAxis.min;
            range._maxWidth =
              _getElementBoundingClientRect(plotBackground).width;
            range._reflectToDom();
          }
        }

        if (timestamp) {
          timestamp._plotBackgroundChartOffset =
            this._chart._plotBackgroundChartOffset;
        }

        if (range) {
          range._plotBackgroundChartOffset =
            this._chart._plotBackgroundChartOffset;
        }

        //  resize the selection area to the size of the Highcharts plot background.
        this._updateSelectionAreaSize(plotBackground);
      });

    this._plotBackground$
      .pipe(take(1), takeUntil(this._destroy$))
      .subscribe(() => {
        // start initializing the selection area with all the mouse events.
        this._initializeSelectionArea();
        // initializes the Hairline, the timestamp that follows the mouse
        // and listens for mouse-moves to update the position of the hairline.
        this._initializeHairline();
      });
  }

  ngOnDestroy(): void {
    this._closeOverlay();
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Is used to create a selection that is triggered
   * by keyboard interaction on hitting enter
   *
   * @param selectionAreaBcr The bounding client rect of the selection area
   */
  private _createSelection(selectionAreaBcr: ClientRect): void {
    if (
      (this._chart._range && this._chart._timestamp) ||
      this._chart._timestamp
    ) {
      // place the timestamp in the middle
      // eslint-disable-next-line no-magic-numbers
      this._setTimestamp(selectionAreaBcr.width / 2);
    } else {
      // eslint-disable-next-line no-magic-numbers
      const quarter = selectionAreaBcr.width / 4;
      // eslint-disable-next-line no-magic-numbers
      this._setRange(quarter, quarter * 2);
    }
  }

  /** Toggles the range and sets it programmatically with the provided values */
  private _setRange(left: number, maxWidth: number, width?: number): void {
    if (!this._chart._range) {
      return;
    }

    this._closeOverlay();
    this._toggleRange(true);
    const minWidth = !width
      ? this._chart._range._calculateMinWidth(left)
      : width;
    const range = { left, width: minWidth };
    this._chart._range._area = clampRange(range, maxWidth, minWidth);
    this._zone.onMicrotaskEmpty
      .pipe(take(1), takeUntil(this._destroy$))
      .subscribe(() => {
        if (this._chart._range) {
          this._chart._range.focus();
          this._chart._range._reflectRangeReleased(true);
        }
      });
  }

  /** Toggles the timestamp and sets it programmatically with the provided value */
  private _setTimestamp(position: number): void {
    if (!this._chart._timestamp) {
      return;
    }
    this._closeOverlay();
    this._toggleTimestamp(true);
    this._chart._timestamp._position = position;
    this._zone.onMicrotaskEmpty
      .pipe(take(1), takeUntil(this._destroy$))
      .subscribe(() => {
        if (this._chart._timestamp) {
          this._chart._timestamp.focus();
        }
      });
  }

  /** Collects all elements that are needed to capture mouse events on the chart */
  private _getHighchartsSeriesGroupAndAxis(): HTMLElement[] {
    const yAxisGrids = [].slice.call(
      this._chart._container.nativeElement.querySelectorAll(
        HIGHCHARTS_Y_AXIS_GRID,
      ),
    );
    const xAxisGrids = [].slice.call(
      this._chart._container.nativeElement.querySelectorAll(
        HIGHCHARTS_X_AXIS_GRID,
      ),
    );
    const seriesGroup = this._chart._container.nativeElement.querySelector(
      HIGHCHARTS_SERIES_GROUP,
    );

    return [seriesGroup, ...xAxisGrids, ...yAxisGrids];
  }

  /**
   * Creates a flexible position strategy for the selection area overlay.
   *
   * @param ref ElementRef of the timestamp or range to center the overlay
   */
  private _calculateOverlayPosition(
    ref: ElementRef<HTMLElement>,
    viewportOffset: ViewportBoundaries,
  ): DtFlexibleConnectedPositionStrategy {
    return new DtFlexibleConnectedPositionStrategy(
      ref,
      this._viewportRuler,
      this._document,
      this._platform,
      this._overlayContainer,
    )
      .withPositions(DT_SELECTION_AREA_OVERLAY_POSITIONS)
      .withViewportBoundaries(viewportOffset)
      .withPush(false)
      .withLockedPosition(false);
  }

  /**
   * Creates a new Overlay for the range or timestamp with the provided template
   * and positions it connected to the provided ref (range or timestamp).
   */
  private _createOverlay<T>(
    template: TemplateRef<T>,
    ref: ElementRef<HTMLElement>,
    viewRef: ViewContainerRef,
    viewportOffset: ViewportBoundaries,
    data: number | [number, number],
  ): void {
    // create a new overlay configuration with a position strategy that connects
    // to the provided ref.
    // The overlay should be repositioned on scroll.
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._calculateOverlayPosition(ref, viewportOffset),
      backdropClass: 'dt-no-pointer',
      hasBackdrop: true,
      panelClass: ['dt-chart-selection-area-overlay'],
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
    });

    const overlayRef = this._overlay.create(overlayConfig);

    // create the portal out of the template and the containerRef
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._portal = new TemplatePortal<any>(template, viewRef, {
      $implicit: data,
    });
    // attach the portal to the overlay ref
    overlayRef.attach(this._portal);

    this._overlayRef = overlayRef;
  }

  /** Updates or creates an overlay for the range or timestamp. */
  private _updateOrCreateOverlay<T = unknown>(
    component: DtChartRange | DtChartTimestamp,
    ref: ElementRef<HTMLElement>,
    viewportOffset: ViewportBoundaries = { left: 0, top: 0 },
  ): void {
    const template = component._overlayTemplate as TemplateRef<T>;
    const viewRef = component._viewContainerRef;
    const value: number | [number, number] = component.value;

    if (this._portal && this._overlayRef) {
      this._portal.context.$implicit = value;
      // We already have an overlay so update the position
      this._overlayRef.updatePositionStrategy(
        this._calculateOverlayPosition(ref, viewportOffset),
      );
      this._changeDetectorRef.markForCheck();
    } else {
      this._createOverlay<T>(template, ref, viewRef, viewportOffset, value);
    }
  }

  /** If there is an overlay open it will dispose it and destroy it */
  private _closeOverlay(): void {
    // remove class showing the arrows of the range handles
    if (this._chart._range) {
      this._chart._range._reflectRangeReleased(false);
    }

    if (this._overlayRef) {
      this._overlayRef.dispose();
    }

    this._overlayRef = null;
    this._portal = null;
  }

  /** Main method that initializes all streams and subscribe to the initial behavior of the selection area */
  private _initializeSelectionArea(): void {
    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // E V E N T   S T R E A M S
    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // The following section is for registering the events that track the mousedown, hover
    // drag and all interactions. This streams are stored in class members.

    // stream that emits a touch start on all mouse down elements
    const touchStart$ = this._mouseDownElements$.pipe(
      switchMap((elements) =>
        getTouchStartStream(this._elementRef.nativeElement, elements),
      ),
      share(),
    );

    this._mousedown$ = this._mouseDownElements$.pipe(
      switchMap((elements) =>
        getMouseDownStream(this._elementRef.nativeElement, elements),
      ),
      share(),
    );

    const touchStartAndMouseDown$ = merge(this._mousedown$, touchStart$);

    const touchEnd$ = getTouchEndStream(this._elementRef.nativeElement).pipe(
      share(),
    );

    this._mouseup$ = getMouseUpStream(this._elementRef.nativeElement).pipe(
      share(),
    );

    this._click$ = this._mouseDownElements$.pipe(
      switchMap((elements) =>
        merge(
          getClickStream(
            this._elementRef.nativeElement,
            this._mousedown$,
            this._mouseup$,
          ),
          getTouchStream(
            this._elementRef.nativeElement,
            touchStart$,
            getTouchEndStream(
              this._elementRef.nativeElement,
              captureAndMergeEvents('touchend', elements),
            ),
            getTouchMove(elements),
          ),
        ),
      ),
      share(),
    );

    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // T I M E S T A M P
    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // if we have a timestamp component inside the chart we have to update the position
    // every time there is a click with the relative mouse position on the xAxis.
    if (this._chart._timestamp) {
      this._click$.pipe(takeUntil(this._destroy$)).subscribe(({ x }) => {
        if (this._chart._timestamp) {
          this._chart._timestamp._position = x;
        }
      });
      // after a click happened and the timestamp is visible in the queryList we focus the timestamp
      this._click$
        .pipe(
          filter(() => Boolean(this._chart._timestamp)),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          switchMap(() => this._chart._timestamp!._timestampElementRef.changes),
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          if (this._chart._timestamp) {
            this._chart._timestamp.focus();
          }
        });

      this._chart._timestamp._switchToRange
        .pipe(
          withLatestFrom(this._selectionAreaBcr$),
          takeUntil(this._destroy$),
        )
        .subscribe(([left, selectionAreaBcr]) => {
          this._setRange(left, selectionAreaBcr.width);
        });
    }

    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // R A N G E
    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // If there is a range component we have to check for drag events and resizing
    // and updates of the range.
    if (this._chart._range) {
      // touch event on the window that creates a touchmove
      const touch = fromEvent<TouchEvent>(window, 'touchmove', {
        passive: true,
      }).pipe(share());
      // Create a stream for drag handle event in case we have to block the click event
      // with an event prevent default inside the range component. Therefore we emit the
      // dragHandleStart$ stream to notify when a drag on a handle happens.
      const dragHandleStart$ = this._chart._range._handleDragStarted.pipe(
        tap(() => {
          _removeCssClass(
            this._elementRef.nativeElement,
            NO_POINTER_EVENTS_CLASS,
          );
        }),
        share(),
      );

      this._drag$ = merge(
        getDragStream(
          this._elementRef.nativeElement,
          this._mousedown$,
          this._mouseup$,
        ),
        getDragStream(
          this._elementRef.nativeElement,
          touchStart$,
          touchEnd$,
          touch,
        ),
      );

      this._dragHandle$ = merge(
        getDragStream(
          this._elementRef.nativeElement,
          dragHandleStart$,
          this._mouseup$,
        ),
        getDragStream(
          this._elementRef.nativeElement,
          dragHandleStart$,
          touchEnd$,
          touch,
        ),
      );

      const relativeTouchOrMouseDown = <T extends TouchEvent | MouseEvent>(
        event$: Observable<T>,
      ) =>
        event$.pipe(
          map((event: T) =>
            getRelativeMousePosition(event, this._elementRef.nativeElement),
          ),
        );

      const rangeCreate$ = this._selectionAreaBcr$.pipe(
        switchMap((bcr) =>
          getRangeCreateStream(
            merge(
              relativeTouchOrMouseDown(this._mousedown$),
              relativeTouchOrMouseDown(touchStart$),
            ),
            this._drag$,
            bcr.width,
          ),
        ),
      );

      const rangeResize$ = this._selectionAreaBcr$.pipe(
        filter(() => Boolean(this._chart._range)),
        switchMap((bcr) =>
          getRangeResizeStream(
            this._dragHandle$,
            dragHandleStart$,
            bcr.width,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            () => this._chart._range!._area,
            (start: number, end: number) =>
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this._chart._range!._isRangeValid(start, end),
            (left: number, width: number) =>
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this._chart._range!._getRangeValuesFromPixels(left, width),
          ),
        ),
      );

      // Create a range on the selection area if a drag is happening.
      // and listen for resizing of an existing selection area
      merge(
        rangeCreate$,
        // update a selection area according to a resize through the side handles
        rangeResize$,
      )
        .pipe(
          takeUntil(this._destroy$),
          filter((area) => this._isRangeInsideMaximumConstraint(area)),
        )
        .subscribe((area) => {
          if (this._chart._range) {
            this._chart._range._area = area;
          }
        });

      this._chart._range._switchToTimestamp
        .pipe(takeUntil(this._destroy$))
        .subscribe((position: number) => {
          this._setTimestamp(position);
        });

      const dragHandleStartMapped$ = this._dragHandle$.pipe(mapTo(1));
      const initialDragStart$ = this._drag$.pipe(mapTo(0));
      // merge the streams of the initial drag start and the handle drag start
      const startResizing$ = merge(initialDragStart$, dragHandleStartMapped$);
      // map to false to end the resize
      const release$ = merge(this._mouseup$, touchEnd$).pipe(mapTo(-1));

      // mouse Release is -1
      const isMouseRelease = (resize: number) => resize === -1;

      startResizing$
        .pipe(
          switchMap((startValue) => release$.pipe(startWith(startValue))),
          distinctUntilChanged(),
          takeUntil(this._destroy$),
        )
        .subscribe((resize: number) => {
          // show drag arrows on drag release but only if the stream is not a drag handle
          // 0 is initial drag and -1 is mouse release
          if (this._chart._range && resize < 1) {
            this._chart._range._reflectRangeReleased(isMouseRelease(resize));

            // if the drag is completed we can emit a stateChanges
            if (isMouseRelease(resize)) {
              this._chart._range._emitDragEnd();
              this._chart._range.focus();
            }
          }

          // every drag regardless of if it is a handle or initial drag should have the grab cursors
          if (resize >= 0) {
            _addCssClass(this._elementRef.nativeElement, GRAB_CURSOR_CLASS);
          } else {
            _removeCssClass(this._elementRef.nativeElement, GRAB_CURSOR_CLASS);
          }
        });
    }
    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // T I M E S T A M P  +  R A N G E
    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // Decide weather to show the range or a timestamp according to a click or a drag.
    // On a mousedown the range and the timestamp have to be hidden.
    const startShowingTimestamp$ = this._click$.pipe(mapTo(true));
    const startShowingRange$ = this._drag$.pipe(mapTo(true));
    let hideTimestampAndRange$ = touchStartAndMouseDown$.pipe(mapTo(false));

    // If there is only a timestamp a click should hide and show a timestamp
    if (this._chart._timestamp && !this._chart._range) {
      hideTimestampAndRange$ = this._click$.pipe(mapTo(false));
    }

    // If we only have a range it should be only closed on overlay close.
    if (this._chart._range && !this._chart._timestamp) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      hideTimestampAndRange$ = this._chart._range!._closeOverlay.pipe(
        mapTo(false),
      );
    }

    merge(hideTimestampAndRange$, startShowingRange$)
      .pipe(distinctUntilChanged(), takeUntil(this._destroy$))
      .subscribe((show: boolean) => {
        this._toggleRange(show);
      });

    merge(hideTimestampAndRange$, startShowingTimestamp$)
      .pipe(distinctUntilChanged(), takeUntil(this._destroy$))
      .subscribe((show: boolean) => {
        this._toggleTimestamp(show);
      });

    // Reset range or timestamp if one of each triggers a stateChanges and is now visible
    // the other one has to be hidden then. There can only be one of both.
    if (this._chart._timestamp && this._chart._range) {
      merge(
        this._chart._timestamp._stateChanges,
        this._chart._range._stateChanges,
      )
        .pipe(
          takeUntil(this._destroy$),
          filter((event) => !event.hidden),
          distinctUntilChanged(),
        )
        .subscribe((state) => {
          if (
            this._chart._range &&
            state instanceof TimestampStateChangedEvent
          ) {
            this._chart._range._reset();
          }
          if (
            this._chart._timestamp &&
            state instanceof RangeStateChangedEvent
          ) {
            this._chart._timestamp._reset();
          }
        });
    }

    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // O V E R L A Y
    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // listen for a _closeOverlay event if there is a timestamp or a range

    // close the overlay in range + timestamp mode on every new interaction start with
    // a mouse or touch down.
    let closeOverlay$ = touchStartAndMouseDown$;

    // If there is only a timestamp than we have to close it only on mousedown
    // when it is not hidden
    if (!this._chart._range && this._chart._timestamp) {
      closeOverlay$ = touchStartAndMouseDown$.pipe(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        filter(() => this._chart._timestamp!._hidden),
      );
    }

    // If we have only a range we don't have to add some additional closing behavior
    if (this._chart._range && !this._chart._timestamp) {
      closeOverlay$ = EMPTY;
    }

    merge(
      this._chart._timestamp ? this._chart._timestamp._closeOverlay : EMPTY,
      this._chart._range ? this._chart._range._closeOverlay : EMPTY,
      closeOverlay$,
    )
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._closeOverlay();
      });

    // handling of the overlay for the range
    if (this._chart._range) {
      const elementReferenceStream = getElementRefStream<HTMLDivElement>(
        this._chart._range._stateChanges,
        this._destroy$,
        this._chart._range._rangeElementRef,
        this._zone,
      );
      merge(
        elementReferenceStream,
        this._dragHandle$.pipe(
          getElementRef(this._chart._range._rangeElementRef),
        ),
      )
        .pipe(takeUntil(this._destroy$))
        .subscribe((ref) => {
          if (this._chart._range && this._chart._range._overlayTemplate) {
            this._updateOrCreateOverlay(this._chart._range, ref);
          }
        });

      // update the overlay position if an overlay exists
      // and the viewport size changes
      combineLatest([elementReferenceStream, this._viewportBoundaries$])
        .pipe(
          throttleTime(0, animationFrameScheduler),
          takeUntil(this._destroy$),
        )
        .subscribe(([ref, viewPortOffset]) => {
          if (
            this._overlayRef &&
            this._chart._range &&
            this._chart._range._overlayTemplate
          ) {
            this._updateOrCreateOverlay(
              this._chart._range,
              ref,
              viewPortOffset,
            );
          }
        });
    }

    // handling of the overlay for the timestamp
    if (this._chart._timestamp) {
      getElementRefStream<HTMLDivElement>(
        this._chart._timestamp._stateChanges,
        this._destroy$,
        this._chart._timestamp._timestampElementRef,
        this._zone,
      )
        .pipe(takeUntil(this._destroy$))
        .subscribe((ref) => {
          if (
            this._chart._timestamp &&
            this._chart._timestamp._overlayTemplate
          ) {
            this._updateOrCreateOverlay(this._chart._timestamp, ref);
          }
        });

      // update the overlay position if an overlay exists
      // and the viewport size changes
      combineLatest([
        getElementRefStream<HTMLDivElement>(
          this._chart._timestamp._stateChanges,
          this._destroy$,
          this._chart._timestamp._timestampElementRef,
          this._zone,
        ),
        this._viewportBoundaries$,
      ])
        .pipe(
          throttleTime(0, animationFrameScheduler),
          takeUntil(this._destroy$),
        )
        .subscribe(([ref, viewPortOffset]) => {
          if (
            this._overlayRef &&
            this._chart._timestamp &&
            this._chart._timestamp._overlayTemplate
          ) {
            this._updateOrCreateOverlay(
              this._chart._timestamp,
              ref,
              viewPortOffset,
            );
          }
        });
    }
  }

  /** initializes the hairline the light blue line that follows the cursor */
  private _initializeHairline(): void {
    // hover is used to capture the mousemove on the selection area when pointer events
    // are disabled. So it collects all underlying areas and captures the mousemove
    const hover$ = this._mouseDownElements$.pipe(
      switchMap((elements) =>
        getMouseMove(this._elementRef.nativeElement, elements),
      ),
      share(),
    );

    const mouseOut$ = this._mouseDownElements$.pipe(
      withLatestFrom(this._selectionAreaBcr$),
      switchMap(([elements, bcr]) =>
        getMouseOutStream(this._elementRef.nativeElement, elements, bcr),
      ),
    );

    const showHairline$ = hover$.pipe(mapTo(true));
    const hideHairline$ = merge(this._drag$, this._dragHandle$, mouseOut$).pipe(
      mapTo(false),
    );

    merge(showHairline$, hideHairline$)
      .pipe(distinctUntilChanged(), takeUntil(this._destroy$))
      .subscribe((show: boolean) => {
        this._toggleHairline(show);
      });

    hover$
      .pipe(
        map(({ x }) => x),
        distinctUntilChanged(), // only emit when the x value changes ignore hover on yAxis with that.
        takeUntil(this._destroy$),
      )
      .subscribe((x: number) => {
        this._reflectHairlinePositionToDom(x);
      });
  }

  /** Filter function to check if the created range meets the maximum constraints */
  private _isRangeInsideMaximumConstraint(range: {
    left: number;
    width: number;
  }): boolean {
    if (this._chart._range && this._chart._range._pixelsToValue) {
      // if the range has no max provided every value is okay and we don't need to filter.
      if (!this._chart._range.max) {
        return true;
      }
      const left = this._chart._range._pixelsToValue(range.left);
      const width = this._chart._range._pixelsToValue(range.width);

      return this._chart._range.max >= width - left;
    }
    return false;
  }

  /** Function that toggles the visibility of the hairline (line that follows the mouses) */
  private _toggleHairline(show: boolean): void {
    const element: HTMLElement = this._hairline.nativeElement;
    if (element && element.style) {
      element.style.display = show ? 'inherit' : 'none';
    }
  }

  /** Function that safely toggles the visible state of the range */
  private _toggleRange(show: boolean): void {
    if (this._chart._range) {
      // only run if we have a range
      this._zone.run(() => {
        // needs to run in the zon in case of the hidden has a binding
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this._chart._range!._hidden = !show;
      });
    }
  }

  /** Function that safely toggles the visible state of the timestamp */
  private _toggleTimestamp(show: boolean): void {
    if (this._chart._timestamp) {
      // only run if we have a timestamp
      this._zone.run(() => {
        // needs to run in the zon in case of the hidden has a binding
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this._chart._timestamp!._hidden = !show;
      });
    }
  }

  /** reflects the position of the timestamp to the element */
  private _reflectHairlinePositionToDom(x: number): void {
    const element: HTMLElement = this._hairline.nativeElement;
    if (element && element.style) {
      element.style.transform = `translateX(${x}px)`;
    }
  }

  /** Set the position of the select-able area to the size of the Highcharts plot background */
  private _updateSelectionAreaSize(plotBackground: SVGRectElement): void {
    // get Bounding client Rects of the plot background and the host to calculateRelativeXPos
    // a relative offset.
    const hostBCR = _getElementBoundingClientRect(this._chart._elementRef);
    const plotBCR = _getElementBoundingClientRect(plotBackground);

    const topOffset = plotBCR.top - hostBCR.top;
    const leftOffset = plotBCR.left - hostBCR.left;

    setPosition(this._elementRef.nativeElement, {
      top: topOffset,
      left: leftOffset,
      width: plotBCR.width,
      height: plotBCR.height,
    });
  }
}
/* eslint-disable max-lines */

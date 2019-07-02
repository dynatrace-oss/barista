import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  Renderer2,
  SkipSelf,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  addCssClass,
  removeCssClass,
} from '@dynatrace/angular-components/core';
import {
  animationFrameScheduler,
  EMPTY,
  merge,
  Observable,
  of,
  Subject,
} from 'rxjs';
import {
  concatMapTo,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  skip,
  takeUntil,
  tap,
  throttleTime,
  switchMap,
} from 'rxjs/operators';
import { DtChart } from '../chart';
import { DtChartRange } from '../range/range';
import { DtChartTimestamp } from '../timestamp/timestamp';
import {
  chainFocusTraps,
  getElementRef,
  getRelativeMousePosition,
  setPosition,
} from '../utils';
import {
  DT_SELECTION_AREA_OVERLAY_POSITIONS,
  ERROR_NO_PLOT_BACKGROUND,
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
} from './streams';

@Component({
  selector: 'dt-chart-selection-area',
  templateUrl: 'selection-area.html',
  styleUrls: ['selection-area.scss'],
  // Disable view encapsulation to style the overlay content that is located outside this component
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'dt-chart-selection-area dt-no-pointer-events',
    '[attr.tabindex]': '0',
  },
})
export class DtChartSelectionArea implements AfterContentInit, OnDestroy {
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

  /** The timestamp that follows the mouse */
  @ViewChild('hairline', { static: true })
  private _hairline: ElementRef<HTMLDivElement>;

  private _range?: DtChartRange;
  private _timestamp?: DtChartTimestamp;

  /** The ref of the selection area overlay */
  private _overlayRef: OverlayRef | null;

  /** The focus trap inside the overlay */
  private _overlayFocusTrap: FocusTrap | null;

  private _portal: TemplatePortal | null;

  /**
   * Highcharts plotBackground is used to size the selection area according to this area
   * is set after Highcharts render is completed.
   */
  private _plotBackground: SVGRectElement;

  /** Array of Elements where we capture events in case that we disable pointer events on selection Area */
  private _mouseDownElements: Element[] = [];

  /** Bounding Client Rect of the selection area. set after Highcharts render */
  private _selectionAreaBcr?: ClientRect;

  /** Subject to unsubscribe from every subscription */
  private _destroy$ = new Subject<void>();

  constructor(
    @SkipSelf() private _chart: DtChart,
    private _elementRef: ElementRef<HTMLElement>,
    private _focusTrapFactory: FocusTrapFactory,
    private _renderer: Renderer2,
    private _overlay: Overlay,
    private _zone: NgZone
  ) {}

  ngAfterContentInit(): void {
    // after Highcharts is rendered we can start initializing the selection area.
    this._chart._afterRender
      .pipe(
        concatMapTo(this._chart._plotBackground$),
        // plot background can be null as well
        filter(Boolean),
        takeUntil(this._destroy$)
      )
      .subscribe((plotBackground) => {
        this._plotBackground = plotBackground;
        this._range = this._chart._range;
        this._timestamp = this._chart._timestamp;

        // resize the selection area to the size of the Highcharts plot background.
        this._updateSelectionAreaSize();
        // get the BCR of the selection Area
        this._selectionAreaBcr = this._elementRef.nativeElement.getBoundingClientRect();

        // start initializing the selection area with all the mouse events.
        this._initializeSelectionArea();
        // initializes the Hairline, the timestamp that follows the mouse
        // and listens for mouse-moves to update the position of the hairline.
        this._initializeHairline();
      });

    // we have to skip the first (initial) after render and then we reset
    // the range and timestamp each time something changes.
    this._chart._afterRender
      .pipe(
        skip(1),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        // If the chart changes we need to destroy the range and the timestamp
        if (this._range) {
          this._range._reset();
        }

        if (this._timestamp) {
          this._timestamp._reset();
        }
        this._closeOverlay();
      });
  }

  ngOnDestroy(): void {
    this._closeOverlay();
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Creates a flexible position strategy for the selection area overlay.
   * @param ref ElementRef of the timestamp or range to center the overlay
   */
  private _calculateOverlayPosition(
    ref: ElementRef<HTMLElement>
  ): FlexibleConnectedPositionStrategy {
    const positionStrategy = this._overlay
      .position()
      // Create position attached to the ref of the timestamp or range
      .flexibleConnectedTo(ref)
      // Attach overlay's center bottom point to the
      // top center point of the timestamp or range.
      .withPositions(DT_SELECTION_AREA_OVERLAY_POSITIONS)
      .setOrigin(ref)
      .withLockedPosition(false);

    return positionStrategy;
  }

  /**
   * Creates a new Overlay for the range or timestamp with the provided template
   * and positions it connected to the provided ref (range or timestamp).
   */
  private _createOverlay<T>(
    template: TemplateRef<T>,
    ref: ElementRef<HTMLElement>,
    viewRef: ViewContainerRef
  ): void {
    // create a new overlay configuration with a position strategy that connects
    // to the provided ref.
    // The overlay should be repositioned on scroll.
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._calculateOverlayPosition(ref),
      backdropClass: 'dt-no-pointer',
      hasBackdrop: true,
      panelClass: ['dt-chart-selection-area-overlay'],
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
    });

    const overlayRef = this._overlay.create(overlayConfig);

    // create the portal out of the template and the containerRef
    this._portal = new TemplatePortal(template, viewRef);
    // attach the portal to the overlay ref
    overlayRef.attach(this._portal);

    this._overlayRef = overlayRef;

    if (!this._overlayFocusTrap) {
      this._overlayFocusTrap = this._focusTrapFactory.create(
        this._overlayRef.overlayElement
      );
      this._attachFocusTrapListeners();
    }
  }

  /** Updates or creates an overlay for the range or timestamp. */
  private _updateOrCreateOverlay<T = unknown>(
    template: TemplateRef<T>,
    ref: ElementRef<HTMLElement>,
    viewRef: ViewContainerRef
  ): void {
    if (this._portal && this._overlayRef) {
      // We already have an overlay so update the position
      this._overlayRef.updatePositionStrategy(
        this._calculateOverlayPosition(ref)
      );
    } else {
      this._createOverlay<T>(template, ref, viewRef);
    }
  }

  /** If there is an overlay open it will dispose it and destroy it */
  private _closeOverlay(): void {
    if (this._overlayRef) {
      this._overlayRef.dispose();
    }

    // if we have a focus trap we have to destroy it
    if (this._overlayFocusTrap) {
      this._overlayFocusTrap.destroy();
    }

    this._overlayFocusTrap = null;
    this._overlayRef = null;
    this._portal = null;
  }

  /** Main method that initializes all streams and subscribe to the initial behavior of the selection area */
  private _initializeSelectionArea(): void {
    // If there is no Highcharts pot background something went wrong with the chart and we cannot calculate
    // the positions in case that they are all relative to the plot background and not to the chart.
    // The plot background is the area without the axis description only the chart itself.
    if (!this._plotBackground) {
      throw Error(ERROR_NO_PLOT_BACKGROUND);
    }

    const yAxisGrids = [].slice.call(
      this._chart.container.nativeElement.querySelectorAll(
        HIGHCHARTS_Y_AXIS_GRID
      )
    );
    const xAxisGrids = [].slice.call(
      this._chart.container.nativeElement.querySelectorAll(
        HIGHCHARTS_X_AXIS_GRID
      )
    );
    const seriesGroup = this._chart.container.nativeElement.querySelector(
      HIGHCHARTS_SERIES_GROUP
    );

    // select all elements where we have to capture the mousemove when pointer events are
    // disabled on the selection area.
    this._mouseDownElements = [
      this._plotBackground,
      seriesGroup,
      ...xAxisGrids,
      ...yAxisGrids,
    ];

    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // E V E N T   S T R E A M S
    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // The following section is for registering the events that track the mousedown, hover
    // drag and all interactions. This streams are stored in class members.

    this._mousedown$ = getMouseDownStream(
      this._elementRef.nativeElement,
      this._mouseDownElements
    );

    this._mouseup$ = getMouseUpStream(this._elementRef.nativeElement);

    this._click$ = getClickStream(
      this._elementRef.nativeElement,
      this._mousedown$,
      this._mouseup$
    );

    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // T I M E S T A M P
    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // if we have a timestamp component inside the chart we have to update the position
    // every time there is a click with the relative mouse position on the xAxis.
    if (this._timestamp) {
      this._click$.pipe(takeUntil(this._destroy$)).subscribe(({ x }) => {
        if (this._timestamp) {
          this._timestamp._position = x;
        }
      });

      // after a click happened and the timestamp is visible in the queryList we focus the timestamp
      this._click$.pipe(
        switchMap(() => this._timestamp!._timestampElementRef.changes)
      ).subscribe(() => {
        // query list is not always present
        if (this._timestamp && this._timestamp._timestampElementRef.first) {
          this._timestamp._timestampElementRef.first.nativeElement.focus();
        }
      });
    }

    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // R A N G E
    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // If there is a range component we have to check for drag events and resizing
    // and updates of the range.
    if (this._range) {
      this._drag$ = getDragStream(
        this._elementRef.nativeElement,
        this._mousedown$,
        this._mouseup$
      );

      // Create a stream for drag handle event in case we have to block the click event
      // with an event prevent default inside the range component. Therefore we emit the
      // dragHandleStart$ stream to notify when a drag on a handle happens.
      const dragStart$ = this._range._handleDragStarted.pipe(
        tap(() => {
          removeCssClass(
            this._elementRef.nativeElement,
            NO_POINTER_EVENTS_CLASS
          );
        })
      );

      this._dragHandle$ = getDragStream(
        this._elementRef.nativeElement,
        dragStart$,
        this._mouseup$
      );

      const relativeMouseDown$ = this._mousedown$.pipe(
        map((event: MouseEvent) =>
          getRelativeMousePosition(event, this._elementRef.nativeElement)
        )
      );

      // Create a range on the selection area if a drag is happening.
      // and listen for resizing of an existing selection area
      merge(
        getRangeCreateStream(
          relativeMouseDown$,
          this._drag$,
          this._selectionAreaBcr!.width
        ),
        // update a selection area according to a resize through the side handles
        getRangeResizeStream(
          this._dragHandle$,
          this._range._handleDragStarted.pipe(distinctUntilChanged()),
          this._selectionAreaBcr!.width,
          () => this._range!._area,
          (start: number, end: number) =>
            this._range!._isRangeValid(start, end),
          (left: number, width: number) =>
            this._range!._getRangeValuesFromPixels(left, width)
        )
      )
        .pipe(
          takeUntil(this._destroy$),
          filter((area) => this._isRangeInsideMaximumConstraint(area))
        )
        .subscribe((area) => {
          if (this._range) {
            this._range._area = area;
          }
        });

      this._zone.runOutsideAngular(() => {
        const dragHandleStart$ = this._dragHandle$.pipe(mapTo(1));
        const initialDragStart$ = this._drag$.pipe(mapTo(0));
        // merge the streams of the initial drag start and the handle drag start
        const startResizing$ = merge(initialDragStart$, dragHandleStart$);
        // map to false to end the resize
        const mouseRelease$ = this._mouseup$.pipe(mapTo(-1));

        // stream that emits drag start end end
        merge(startResizing$, mouseRelease$)
          .pipe(
            distinctUntilChanged(),
            takeUntil(this._destroy$)
          )
          .subscribe((resize: number) => {
            // show drag arrows on drag release but only if the stream is not a drag handle
            // 0 is initial drag and -1 is mouse release
            if (this._range && resize < 1) {
              this._range._reflectRangeReleased(resize < 0);

              // if the drag is completed we can emit a stateChanges
              if (resize < 0) {
                this._range._emitDragEnd();

                // query list is not always present
                if (this._range._rangeElementRef.first) {
                  this._range._rangeElementRef.first.nativeElement.focus();
                }
              }
            }

            // every drag regardless of if it is a handle or initial drag should have the grab cursors
            if (resize >= 0) {
              addCssClass(this._elementRef.nativeElement, GRAB_CURSOR_CLASS);
            } else {
              removeCssClass(this._elementRef.nativeElement, GRAB_CURSOR_CLASS);
            }
          });
      });
    }

    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // T I M E S T A M P  +  R A N G E
    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // Decide weather to show the range or a timestamp according to a click or a drag.
    // On a mousedown the range and the timestamp have to be hidden.
    const startShowingTimestamp$ = this._click$.pipe(mapTo(true));
    const startShowingRange$ = this._drag$.pipe(mapTo(true));
    const hideTimestampAndRange$ = this._mousedown$.pipe(mapTo(false));

    merge(startShowingRange$, hideTimestampAndRange$)
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroy$)
      )
      .subscribe((show: boolean) => {
        this._showRange(show);
      });

    merge(startShowingTimestamp$, hideTimestampAndRange$)
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroy$)
      )
      .subscribe((show: boolean) => {
        this._showTimestamp(show);
      });

    // Reset range or timestamp if one of each triggers a stateChanges and is now visible
    // the other one has to be hidden then. There can only be one of both.
    if (this._timestamp && this._range) {
      merge(
        this._timestamp._stateChanges.pipe(
          map((v) => ({ ...v, type: 'timestamp' }))
        ),
        this._range._stateChanges.pipe(map((v) => ({ ...v, type: 'range' })))
      )
        .pipe(
          takeUntil(this._destroy$),
          filter((event) => !event.hidden),
          distinctUntilChanged()
        )
        .subscribe((state) => {
          if (this._range && state.type === 'timestamp') {
            this._range._reset();
          }

          if (this._timestamp && state.type === 'range') {
            this._timestamp._reset();
          }
        });
    }

    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // O V E R L A Y
    // –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // listen for a _closeOverlay event if there is a timestamp or a range
    merge(
      this._timestamp ? this._timestamp._closeOverlay : of(null),
      this._range ? this._range._closeOverlay : of(null),
      this._mousedown$
    )
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._closeOverlay();
      });

    // handling of the overlay for the range
    if (this._range) {
      getElementRefStream<HTMLDivElement>(
        this._range._stateChanges,
        this._destroy$,
        this._range._rangeElementRef,
        this._zone
      ).subscribe((ref) => {
        if (this._range && this._range._overlayTemplate) {
          this._updateOrCreateOverlay(
            this._range._overlayTemplate,
            ref,
            this._range._viewContainerRef
          );
        }
      });

      // On dragHandle we want to reposition the overlay with a small delay and an animationFrameScheduler
      this._dragHandle$
        .pipe(
          throttleTime(0, animationFrameScheduler),
          getElementRef(this._range._rangeElementRef),
          takeUntil(this._destroy$)
        )
        .subscribe((ref) => {
          if (this._range && this._range._overlayTemplate) {
            this._updateOrCreateOverlay(
              this._range._overlayTemplate,
              ref,
              this._range._viewContainerRef
            );
          }
        });
    }

    // handling of the overlay for the timestamp
    if (this._timestamp) {
      getElementRefStream<HTMLDivElement>(
        this._timestamp._stateChanges,
        this._destroy$,
        this._timestamp._timestampElementRef,
        this._zone
      ).subscribe((ref) => {
        if (this._timestamp && this._timestamp._overlayTemplate) {
          this._updateOrCreateOverlay(
            this._timestamp._overlayTemplate,
            ref,
            this._timestamp._viewContainerRef
          );
        }
      });
    }
  }

  /** initializes the hairline the light blue line that follows the cursor */
  private _initializeHairline(): void {
    this._zone.runOutsideAngular(() => {
      // hover is used to capture the mousemove on the selection area when pointer events
      // are disabled. So it collects all underlying areas and captures the mousemove
      const hover$ = getMouseMove(
        this._elementRef.nativeElement,
        this._mouseDownElements
      );

      const mouseOut$ = getMouseOutStream(
        this._elementRef.nativeElement,
        this._mouseDownElements,
        this._selectionAreaBcr!
      );

      const showHairline$ = hover$.pipe(mapTo(true));
      const hideHairline$ = merge(
        this._range ? this._mousedown$ : of(null),
        this._dragHandle$,
        mouseOut$
      ).pipe(mapTo(false));

      merge(showHairline$, hideHairline$)
        .pipe(
          distinctUntilChanged(),
          takeUntil(this._destroy$)
        )
        .subscribe((show: boolean) => {
          this._showHairline(show);
        });

      hover$
        .pipe(
          map(({ x }) => x),
          distinctUntilChanged(), // only emit when the x value changes ignore hover on yAxis with that.
          takeUntil(this._destroy$)
        )
        .subscribe((x: number) => {
          this._reflectHairlinePositionToDom(x);
        });
    });
  }

  /** Attaches the event listeners for the focus traps connected to each other */
  private _attachFocusTrapListeners(): void {
    this._zone.runOutsideAngular(() => {

      if (
        !this._overlayFocusTrap ||
        !this._overlayRef
      ) {
        return;
      }

      const traps = [this._overlayFocusTrap];
      const anchors = [this._overlayRef.hostElement];

      if (
        this._range &&
        this._range._rangeElementRef.first
      ) {
        traps.push(this._range._selectedAreaFocusTrap.focusTrap);
        anchors.push(this._range._viewContainerRef.element.nativeElement);
      }

      if (
        this._timestamp &&
        this._timestamp._timestampElementRef.first
      ) {
        traps.push(this._timestamp._selectedFocusTrap.focusTrap);
        anchors.push(this._timestamp._viewContainerRef.element.nativeElement);
      }

      chainFocusTraps(traps, anchors);
    });
  }

  /** Filter function to check if the created range meets the maximum constraints */
  private _isRangeInsideMaximumConstraint(range: {
    left: number;
    width: number;
  }): boolean {
    if (this._range && this._range._pixelsToValue) {
      // if the range has no max provided every value is okay and we don't need to filter.
      if (!this._range.max) {
        return true;
      }
      const left = this._range._pixelsToValue(range.left);
      const width = this._range._pixelsToValue(range.width);

      return this._range.max >= width - left;
    }
    return false;
  }

  /** Function that toggles the visibility of the hairline (line that follows the mouses) */
  private _showHairline(show: boolean): void {
    const display = show ? 'inherit' : 'none';
    this._renderer.setStyle(this._hairline.nativeElement, 'display', display);
  }

  /** Function that safely toggles the visible state of the range */
  private _showRange(show: boolean): void {
    if (this._range) {
      this._range._hidden = !show;
    }
  }

  /** Function that safely toggles the visible state of the timestamp */
  private _showTimestamp(show: boolean): void {
    if (this._timestamp) {
      this._timestamp._hidden = !show;
    }
  }

  /** reflects the position of the timestamp to the element */
  private _reflectHairlinePositionToDom(x: number): void {
    this._zone.runOutsideAngular(() => {
      this._renderer.setStyle(
        this._hairline.nativeElement,
        'transform',
        `translateX(${x}px)`
      );
    });
  }

  /** Set the position of the select-able area to the size of the highcharts plot background */
  private _updateSelectionAreaSize(): void {
    if (!this._plotBackground) {
      throw Error(ERROR_NO_PLOT_BACKGROUND);
    }

    // get Bounding client Rects of the plot background and the host to calculateRelativeXPos
    // a relative offset.
    const hostBCR = this._elementRef.nativeElement.getBoundingClientRect();
    const plotBCR = this._plotBackground.getBoundingClientRect();

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

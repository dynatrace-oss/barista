import { Overlay, OverlayConfig, OverlayRef, ConnectedPosition, FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, Renderer2, SkipSelf, ViewChild, ViewEncapsulation, TemplateRef, ViewContainerRef, ChangeDetectorRef, QueryList } from '@angular/core';
import { animationFrameScheduler, combineLatest, EMPTY, from, fromEvent, merge, Observable, ReplaySubject, Subject, of } from 'rxjs';
import { concatMapTo, distinctUntilChanged, filter, map, mapTo, pairwise, share, skip, switchMap, takeUntil, tap, throttleTime, withLatestFrom, distinctUntilKeyChanged } from 'rxjs/operators';
import { addCssClass, removeCssClass } from '../..';
import { DtChart } from '../chart';
import { DtChartRange } from '../range/range';
import { DtChartTimestamp } from '../timestamp/timestamp';
import { captureAndMergeEvents, getRelativeMousePosition, identifyLeftOrRightHandle, setPosition } from '../utils';
import { calculatePosition, DtSelectionAreaEventTarget } from './position-utils';
import { TemplatePortal } from '@angular/cdk/portal';

const ERROR_NO_PLOT_BACKGROUND = 'Highcharts has not rendered yet! You Requested a Highcharts internal element!';

const HIGHCHARTS_X_AXIS_GRID = '.highcharts-grid highcharts-xaxis-grid';
const HIGHCHARTS_Y_AXIS_GRID = '.highcharts-grid highcharts-yaxis-grid';
const HIGHCHARTS_SERIES_GROUP = '.highcharts-series-group';

const NO_POINTER_EVENTS_CLASS = 'dt-no-pointer-events';
const GRAB_CURSOR_CLASS = 'dt-pointer-grabbing';

/** Vertical distance between the overlay and the selection area */
const DT_SELECTION_AREA_OVERLAY_SPACING = 4;

/** The size factor to the origin width the selection area is created with when created by keyboard */
const DT_SELECTION_AREA_KEYBOARD_DEFAULT_SIZE = 0.5;

/** The position the selection area is created at when created by keyboard */
const DT_SELECTION_AREA_KEYBOARD_DEFAULT_START = 0.25;

/** Positions for the overlay used in the selection area */
const DT_SELECTION_AREA_OVERLAY_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -DT_SELECTION_AREA_OVERLAY_SPACING,
  },
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetY: -DT_SELECTION_AREA_OVERLAY_SPACING,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -DT_SELECTION_AREA_OVERLAY_SPACING,
  },
  {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: DT_SELECTION_AREA_OVERLAY_SPACING,
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetY: DT_SELECTION_AREA_OVERLAY_SPACING,
  },
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: DT_SELECTION_AREA_OVERLAY_SPACING,
  },
];

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
  },
})
export class DtChartSelectionArea implements OnDestroy {

  /** If the selection area is disabled */
  @Input() disabled = false;

  _disableRange = false;
  _disableTimestamp = false;

  /** @internal mousedown event stream on the selection area emits only left mouse */
  _mousedown$: Observable<MouseEvent> = EMPTY;
  /** @internal mousemove event stream from window */
  _mousemove$: Observable<MouseEvent> = EMPTY;
  /** @internal mouse up stream on the window */
  _mouseup$: Observable<MouseEvent> = EMPTY;
  /** @internal drag event based on a left click on the selection area */
  _drag$: Observable<{x: number; y: number}> = EMPTY;
  /** @internal drag event triggered by a boundary drag-resize *(only available within a range)* */
  _dragHandle$: Observable<{x: number; y: number}> = EMPTY;
  /** @internal click event stream that emits only click events on the selection area */
  _click$: Observable<MouseEvent> = EMPTY;
  /** @internal event for hovering the selection area */
  _hover$: Observable<MouseEvent> = EMPTY;
  /** @internal stream that emits the current relative mouse position on the selection area */
  _currentMousePosition$: Observable<{x: number; y: number}> = EMPTY;

  /** The timestamp that follows the mouse */
  @ViewChild('hairline') private _hairline: ElementRef<HTMLDivElement>;

  private _range?: DtChartRange;
  private _timestamp?: DtChartTimestamp;

  /**
   * @internal
   * Highcharts plotBackground is used to size the selection area according to this area
   * is set after Highcharts render is completed.
   */
  private _plotBackground: SVGRectElement;

  /** Bounding Client Rect of the selection area. set after Highcharts render */
  private _selectionAreaBcr?: ClientRect;

  private _destroy$ = new Subject<void>();

  constructor(
    @SkipSelf() private _chart: DtChart,
    private _elementRef: ElementRef<HTMLElement>,
    private _renderer: Renderer2,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterContentInit(): void {
    // after Highcharts is rendered we can start initializing the selection area.
    this._chart._afterRender.pipe(
      concatMapTo(this._chart._plotBackground$),
      // plot background can be null as well
      filter(Boolean),
      takeUntil(this._destroy$)
    ).subscribe((plotBackground) => {
      this._plotBackground = plotBackground;
      this._range = this._chart._range;
      this._timestamp = this._chart._timestamp;

      // resize the selection area to the size of the Highcharts plot background.
      this._updateSelectionAreaSize();
      // get the BCR of the selection Area
      this._selectionAreaBcr = this._elementRef.nativeElement.getBoundingClientRect();

      // start initializing the selection area with all the mouse events.
      this._initializeSelectionArea();
      // initializes the Hairline directive, the timestamp that follows the mouse
      // and listens for mouse-moves to update the position of the hairline.
      this._initializeHairline();
    });

    // we have to skip the first (initial) after render and then we reset
    // the range and timestamp each time something changes.
    this._chart._afterRender.pipe(
      skip(1),
      takeUntil(this._destroy$)
    ).subscribe(() => {
      // If the chart changes we need to destroy the range and the timestamp
      if (this._range) {
        this._range._reset();
      }

      if (this._timestamp) {
        this._timestamp._reset();
      }

    });
  }

  ngOnDestroy(): void {
    this._closeOverlay();
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _overlayRef: OverlayRef | null;
  private _portal: TemplatePortal | null;

  private _createOverlay<T>(data: T, template: TemplateRef<T>, ref: ElementRef<HTMLElement>): void {

    const overlayConfig = new OverlayConfig({
      positionStrategy: this._calculateOverlayPosition(ref),
      backdropClass: 'dt-no-pointer',
      hasBackdrop: true,
      panelClass: ['dt-chart-selection-area-overlay'],
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
    });

    const overlayRef = this._overlay.create(overlayConfig);
    // tslint:disable-next-line:no-any
    this._portal = new TemplatePortal<any>(template, this._viewContainerRef, { $implicit: data });

    overlayRef.attach(this._portal);

    this._overlayRef = overlayRef;
  }

  private _calculateOverlayPosition(ref: ElementRef<HTMLElement>): FlexibleConnectedPositionStrategy {
    const positionStrategy = this._overlay.position()
      // Create position attached to the ref of the timestamp or range
      .flexibleConnectedTo(ref)
      // Attach overlay's center bottom point to the
      // top center point of the timestamp or range.
      .withPositions(DT_SELECTION_AREA_OVERLAY_POSITIONS)
      .setOrigin(ref)
      .withLockedPosition(false);

    return positionStrategy;
  }

  /** updates or creates an overlay with the provided data */
  private _updateOrCreateOverlay<T>(data: T, template: TemplateRef<T>, ref: ElementRef<HTMLElement>): void {
    if (this._portal && this._overlayRef) {
      // We already have an overlay so update the data.
      this._portal.context.$implicit = data;
      this._overlayRef.updatePositionStrategy(this._calculateOverlayPosition(ref));
      // this._changeDetectorRef.markForCheck();
    } else {
      this._createOverlay<T>(data, template, ref);
    }
  }

  private _closeOverlay(): void {
    if (this._overlayRef) {
      this._overlayRef.dispose();
    }
    this._overlayRef = null;
    this._portal = null;
  }

  private _initializeSelectionArea(): void {

    if (!this._plotBackground) {
      throw Error(ERROR_NO_PLOT_BACKGROUND);
    }

    const yAxisGrids = [].slice.call(this._chart.container.nativeElement.querySelectorAll(HIGHCHARTS_Y_AXIS_GRID));
    const xAxisGrids = [].slice.call(this._chart.container.nativeElement.querySelectorAll(HIGHCHARTS_X_AXIS_GRID));
    const seriesGroup = this._chart.container.nativeElement.querySelector(HIGHCHARTS_SERIES_GROUP);

    // select all elements where we have to capture the mousemove when pointer events are disabled on the selection area.
    const mousedownElements = [
      this._plotBackground,
      seriesGroup,
      ...xAxisGrids,
      ...yAxisGrids,
    ];

    // hover is used to capture the mousemove on the selection area when pointer events are disabled.
    // so it collects all underlying areas and captures the mousemove
    this._hover$ = fromEvent<MouseEvent>(mousedownElements, 'mousemove').pipe(
      throttleTime(0, animationFrameScheduler),
      share()
    );

    this._mousedown$ = captureAndMergeEvents('mousedown', mousedownElements).pipe(
      filter((event) => event.button === 0), // only emit left mouse
      filter(() => !this.disabled),
      tap(() => {
        removeCssClass(this._elementRef.nativeElement, NO_POINTER_EVENTS_CLASS);
      }),
      share()
    );

    this._mouseup$ = fromEvent<MouseEvent>(window, 'mouseup').pipe(
      filter(() => !this.disabled),
      tap(() => {
        addCssClass(this._elementRef.nativeElement, NO_POINTER_EVENTS_CLASS);
      }),
      share()
    );

    this._drag$ = this._mousedown$.pipe(
      filter(() => !this._disableRange),
      switchMap(() => fromEvent<MouseEvent>(window, 'mousemove').pipe(takeUntil(this._mouseup$))),
      map((event: MouseEvent) => getRelativeMousePosition(event, this._elementRef.nativeElement)),
      share()
    );

    // Create a click event that listens on a mouse down where the next
    // event is a mouseup and not a mouse-move
    this._click$ = merge(
      this._mousedown$,
      // cannot take the hover, on drag start pointer events are enabled and we have to capture the mousemove
      // on the selection area and not on the underlying events.
      fromEvent<MouseEvent>(this._elementRef.nativeElement, 'mousemove'),
      this._mouseup$
    ).pipe(
      pairwise(),
      filter(([a, b]) => a.type === 'mousedown' && b.type === 'mouseup'),
      map(([a, b]) => b),
      share()
    );

    // Create event that has the relative/current mouse position
    this._currentMousePosition$ = this._mousedown$.pipe(
      map((event: MouseEvent) => getRelativeMousePosition(event, this._elementRef.nativeElement)),
      share()
    );

    // listen for overlay close if there is a timestamp or a range
    merge(
      this._timestamp ? this._timestamp._closeOverlay : of(null),
      this._range ? this._range._closeOverlay : of(null)
    ).pipe(
      takeUntil(this._destroy$)
    ).subscribe(() => {
      this._closeOverlay();
    });

    // TODO: create overlay
    // if (this._timestamp) {
    //   const templateRef = this._timestamp._overlayTemplate;
    //   const ref = this._elementRef;
    //   this._updateOrCreateOverlay({}, templateRef, ref);
    // }

    // Reset range or timestamp if one of each triggers a stateChanges and is now visible
    // the other one has to be hidden then. There can only be one of both.
    if (this._timestamp && this._range) {
      merge(
        this._timestamp._stateChanges.pipe(map((v) => ({...v, type: 'timestamp'}))),
        this._range._stateChanges.pipe(map((v) => ({...v, type: 'range'})))
      ).pipe(
        takeUntil(this._destroy$),
        filter((event) => !event.hidden),
        distinctUntilChanged()
      ).subscribe((state) => {
        if (this._range && state.type === 'timestamp') {
          this._range._reset();
        }

        if (this._timestamp && state.type === 'range') {
          this._timestamp._reset();
        }
      });

      // console.log(this._timestamp._overlayTemplate)

      // this._timestamp._selector.changes.pipe(
      //   map((elements: QueryList<ElementRef>) => elements.first),
      //   filter(Boolean),
      //   withLatestFrom(this._timestamp._stateChanges),
      //   filter(([ref, state]) => !state.hidden),
      //   takeUntil(this._destroy$)
      // ).subscribe(([ref, state]) => {
      //   console.log('display overlay at: ', state.position)
      //   const templateRef = this._timestamp!._overlayTemplate;
      //   this._updateOrCreateOverlay<DtChartTimestampOverlayData>(
      //     { time: state.position},
      //     templateRef,
      //     ref
      //   );
      // });
    }

    const startShowingTimestamp$ = this._click$.pipe(mapTo(true));
    const startShowingRange$ = this._drag$.pipe(mapTo(true));
    const hideTimestampAndRange$ = this._mousedown$.pipe(mapTo(false));

    merge(startShowingRange$, hideTimestampAndRange$).pipe(
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe((showOrHide) => {
      this._showRange(showOrHide);
    });

    merge(startShowingTimestamp$, hideTimestampAndRange$).pipe(
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe((showOrHide) => {
      this._showTimestamp(showOrHide);
    });

    // if we have a timestamp component inside the chart we have to show it on a mouse click
    if (this._timestamp) {
      this._click$.pipe(
        map((event: MouseEvent) => getRelativeMousePosition(event, this._elementRef.nativeElement)),
        takeUntil(this._destroy$)
      ).subscribe(({x, y}) => {
        this._timestamp!._position = x;
      });
    }

    // If there is a range component we have to check for drag events and resizing and updates of the range
    if (this._range) {
      // create a stream for drag handle event
      this._dragHandle$ = from<MouseEvent>(this._range._handleDragStarted).pipe(
        tap(() => { removeCssClass(this._elementRef.nativeElement, NO_POINTER_EVENTS_CLASS); }),
        switchMap(() => fromEvent<MouseEvent>(window, 'mousemove').pipe(takeUntil(this._mouseup$))),
        map((event: MouseEvent) => getRelativeMousePosition(event, this._elementRef.nativeElement)),
        share()
      );

      this._checkRangeResized();
      this._checkForRangeUpdates();
    }
  }

  /** initializes the hairline the light blue line that follows the cursor */
  private _initializeHairline(): void {
    const mouseLeave$ = fromEvent<MouseEvent>(window, 'mousemove').pipe(
      map((event: MouseEvent) => getRelativeMousePosition(event, this._elementRef.nativeElement)),
      filter((position) =>
        position.x < 0 ||
        position.y < 0 ||
        position.x > this._selectionAreaBcr!.width ||
        position.y > this._selectionAreaBcr!.height
      )
      // tap(a => console.log('mouseleave', a))
    );

    const showHairline$ = this._hover$.pipe(mapTo(true));
    const hideHairline$ = merge(
      this._mousedown$,
      this._dragHandle$,
      mouseLeave$
    ).pipe(mapTo(false));

    merge(showHairline$, hideHairline$).pipe(
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe((show: boolean) => {
      // console.log('showHairline: ', show)
      this._showHairline(show);
    });

    this._hover$.pipe(
      map((event: MouseEvent) => getRelativeMousePosition(event, this._elementRef.nativeElement)),
      map((position: {x: number; y: number}) => position.x),
      distinctUntilChanged(), // only emit when the x value changes ignore hover on yAxis with that.
      throttleTime(0, animationFrameScheduler),
      takeUntil(this._destroy$)
    ).subscribe((x: number) => {
      this._reflectHairlinePositionToDom(x);
    });
  }

  private _checkForRangeUpdates(): void {
    if (!this._range) { return; }
    // stream that stores the last positions
    const lastRange$ = new ReplaySubject<{left: number; width: number}>();
    const leftOrRightHandle$ = from(this._range._handleDragStarted).pipe(
      map((event: MouseEvent) => identifyLeftOrRightHandle(event)),
      filter(Boolean),
      distinctUntilChanged()
    );

    // update a selection area according to a resize through the side handles
    const resizeRange$ = combineLatest(
      this._dragHandle$,
      leftOrRightHandle$
    ).pipe(
      withLatestFrom(lastRange$),
      // tap(([range, position, handle]) => console.log(handle)),
      map(([[position, handle], range]) => {
        const delta = handle === 'right'
          ? position.x - (range.left + range.width)
          : position.x - range.left;
        return calculatePosition(
          handle,
          delta,
          range.left,
          range.width,
          this._selectionAreaBcr!.width
        );
      }),
      share()
    );

    // Create a range on the selection area if a drag is happening.
    combineLatest(
      this._currentMousePosition$,
      this._drag$
    ).pipe(
      throttleTime(0, animationFrameScheduler),
      map(([startPosition, endPosition]) =>
        calculatePosition(
          DtSelectionAreaEventTarget.Origin,
          endPosition.x - startPosition.x,
          startPosition.x,
          0,
          this._selectionAreaBcr!.width
        )
      ),
      takeUntil(this._destroy$)
    ).subscribe((range: {left: number; width: number}) => {
      if (this._range) {
        this._range._area = range;
        lastRange$.next(range);
      }
    });

    // show drag arrows on drag release
    merge(
      this._drag$.pipe(mapTo(true)),
      this._mouseup$.pipe(mapTo(false))
    ).pipe(
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe((showOrHide) => {
      if (this._range) {
        this._range._addOrRemoveReleasedClass(!showOrHide);
      }
    });

    // subscribe to changes to a created selection area
    resizeRange$.pipe(
      throttleTime(0, animationFrameScheduler),
      takeUntil(this._destroy$)
    ).subscribe((range) => {
      if (this._range) {
        this._range._area = range;
      }
    });

    // when the range gets updated by a drag on the handles we only set the last position
    // when the drag is completed with a mouseup.
    this._mouseup$.pipe(
      withLatestFrom(resizeRange$),
      map((data) => data[1]),
      takeUntil(this._destroy$)
    ).subscribe((range) => {
      lastRange$.next(range);
    });
  }

  private _showHairline(show: boolean): void {
    const display = show ? 'inherit' : 'none';
    this._renderer.setStyle(this._hairline.nativeElement, 'display', display);
  }

  private _showRange(show: boolean): void {
    if (this._range) {
      this._range._hidden = !show;
    }
  }

  private _showTimestamp(show: boolean): void {
    if (this._timestamp) {
      this._timestamp._hidden = !show;
    }
  }

  /** reflects the position of the timestamp to the element */
  private _reflectHairlinePositionToDom(x: number): void {
    this._renderer.setStyle(
      this._hairline.nativeElement,
      'transform',
      `translateX(${x}px)`
    );
  }

  /**
   * This method watches with a provides start observable if the range is going to be resized.
   * If the range gets resized then we apply a class that changes the cursor.
   */
  private _checkRangeResized(): void {
    const dragHandleStart$ = this._dragHandle$.pipe(mapTo(true));
    const initialDragStart$ = this._drag$.pipe(mapTo(true));
    // merge the streams of the initial drag start and the handle drag start
    const startResizing$ = merge(initialDragStart$, dragHandleStart$);
    // map to false to end the resize
    const mouseRelease$ = this._mouseup$.pipe(mapTo(false));

    // stream that emits drag start end end
    merge(startResizing$, mouseRelease$).pipe(
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe((resize: boolean) => {
      if (resize) {
        addCssClass(this._elementRef.nativeElement, GRAB_CURSOR_CLASS);
      } else {
        removeCssClass(this._elementRef.nativeElement, GRAB_CURSOR_CLASS);
      }
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

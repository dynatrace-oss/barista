import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  SkipSelf,
  OnInit,
  OnDestroy,
  ElementRef,
  ContentChild,
  Input,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { DtChart } from '../chart';
import { takeUntil, share, tap, filter, switchMap, pairwise, map, mapTo, distinctUntilChanged, throttleTime, withLatestFrom, concatMapTo, take, skip } from 'rxjs/operators';
import { Subject, Observable, EMPTY, fromEvent, merge, from, animationFrameScheduler, ReplaySubject, combineLatest } from 'rxjs';
import { removeCssClass, addCssClass } from '../..';
import { DtChartRange, DtChartRangeChanged } from '../range/range';
import { DtChartTimestamp, DtChartTimestampChanged } from '../timestamp/timestamp';

import {
  setPosition,
  getRelativeMousePosition,
  captureAndMergeEvents,
  identifyLeftOrRightHandle,
} from '../utils';
import { calculatePosition, DtSelectionAreaEventTarget } from './position-utils';

const ERROR_NO_PLOT_BACKGROUND = 'Highcharts has not rendered yet! You Requested a Highcharts internal element!';

const HIGHCHARTS_X_AXIS_GRID = '.highcharts-grid highcharts-xaxis-grid';
const HIGHCHARTS_Y_AXIS_GRID = '.highcharts-grid highcharts-yaxis-grid';
const HIGHCHARTS_SERIES_GROUP = '.highcharts-series-group';

const NO_POINTER_EVENTS_CLASS = 'dt-no-pointer-events';
const GRAB_CURSOR_CLASS = 'dt-pointer-grabbing';

@Component({
  selector: 'dt-chart-selection-area',
  templateUrl: 'selection-area.html',
  styleUrls: ['selection-area.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dt-no-pointer-events',
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
    private _renderer: Renderer2
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
    });

    this._chart._afterRender.pipe(
      skip(1),
      takeUntil(this._destroy$)
    ).subscribe(() => {
      // If the chart changes we need to destroy the range and the timestamp
      if (this._range) {
        this._range.reset();
      }

      if (this._timestamp) {
        this._timestamp.reset();
      }

    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _initializeSelectionArea(): void {

    if (!this._plotBackground) {
      throw Error(ERROR_NO_PLOT_BACKGROUND);
    }

    const yAxisGrids = [].slice.call(this._chart.container.nativeElement.querySelectorAll(HIGHCHARTS_Y_AXIS_GRID));
    const xAxisGrids = [].slice.call(this._chart.container.nativeElement.querySelectorAll(HIGHCHARTS_X_AXIS_GRID));
    const seriesGroup = this._chart.container.nativeElement.querySelector(HIGHCHARTS_SERIES_GROUP);

    const mousedownElements = [
      this._plotBackground,
      seriesGroup,
      ...xAxisGrids,
      ...yAxisGrids,
    ];

    this._hover$ = fromEvent<MouseEvent>(mousedownElements, 'mousemove').pipe(
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

    this._mousemove$ = fromEvent<MouseEvent>(window, 'mousemove').pipe(
      filter(() => !this.disabled),
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
      switchMap(() => this._mousemove$.pipe(takeUntil(this._mouseup$))),
      map((event: MouseEvent) => getRelativeMousePosition(event, this._elementRef.nativeElement)),
      share()
    );

    this._click$ = merge(
      this._mousedown$,
      this._mousemove$,
      this._mouseup$
    ).pipe(
      pairwise(),
      filter(([a, b]) => a.type === 'mousedown' && b.type === 'mouseup'),
      map(([a, b]) => b),
      share()
    );

    this._currentMousePosition$ = this._mousedown$.pipe(
      map((event: MouseEvent) => getRelativeMousePosition(event, this._elementRef.nativeElement)),
      share()
    );

    if (this._timestamp && this._range) {
      from<DtChartTimestampChanged>(this._timestamp.changed).pipe(
        filter((event) => !event.hidden),
        distinctUntilChanged(),
        takeUntil(this._destroy$)
      ).subscribe((e) => {
        if (this._range) {
          this._range.reset();
        }
      });

      from<DtChartRangeChanged>(this._range.changed).pipe(
        filter((event) => !event.hidden),
        distinctUntilChanged(),
        takeUntil(this._destroy$)
      ).subscribe((e) => {
        if (this._timestamp) {
          this._timestamp.reset();
        }
      });
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

    // initializes the Hairline directive, the timestamp that follows the mouse
    // and listens for mouse-moves to update the position of the hairline.
    this._initializeHairline();

    // if we have a timestamp component inside the chart we have to show it on a mouseclick
    if (this._timestamp) {
      this._click$.pipe(
        map((event: MouseEvent) => getRelativeMousePosition(event, this._elementRef.nativeElement)),
        takeUntil(this._destroy$)
      ).subscribe(({x, y}) => {
        this._timestamp!.position = x;
      });
    }

    // If there is a range component we have to check for drag events and resizing and updates of the range
    if (this._range) {
      // create a stream for drag handle event
      this._dragHandle$ = from<MouseEvent>(this._range._handleDragStarted).pipe(
        tap(() => { removeCssClass(this._elementRef.nativeElement, NO_POINTER_EVENTS_CLASS); }),
        switchMap(() => this._mousemove$.pipe(takeUntil(this._mouseup$))),
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
      ),
      share()
    );

    const showHairline$ = this._hover$.pipe(mapTo(true));
    const hideHairline$ = merge(this._mousedown$, mouseLeave$).pipe(mapTo(false));

    merge(showHairline$, hideHairline$).pipe(
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe((show: boolean) => {
      this._showHairline(show);
    });

    this._hover$.pipe(
      map((event: MouseEvent) => getRelativeMousePosition(event, this._elementRef.nativeElement)),
      map((position: {x: number; y: number}) => position.x),
      throttleTime(0, animationFrameScheduler)
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
        this._range.area = range;
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
        this._range.area = range;
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
      this._range.hidden = !show;
    }
  }

  private _showTimestamp(show: boolean): void {
    if (this._timestamp) {
      this._timestamp.hidden = !show;
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

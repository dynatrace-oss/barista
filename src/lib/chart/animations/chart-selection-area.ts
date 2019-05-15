import {
  Component,
  SkipSelf,
  ElementRef,
  Input,
  ViewChild,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { DtChart } from '../chart';
import { fromEvent, merge, Subject, Observable, combineLatest, of, EMPTY } from 'rxjs';
import {
  filter,
  tap,
  share,
  switchMap,
  takeUntil,
  pairwise,
  map,
  mapTo,
  distinctUntilChanged,
} from 'rxjs/operators';
import { mixinDisabled, CanDisable } from '@dynatrace/angular-components/core';
import { DtChartSelectionAreaTimestamp } from './timestamp';
import { getRelativeMousePosition, setPosition, MousePosition, createRange } from './utils';
import { DtChartRange } from './range';

const HIGHCHARTS_PLOT_BACKGROUND = '.highcharts-plot-background';

export class DtChartSelectionAreaBase {}
export const _DtChartSelectionAreaBaseMixin = mixinDisabled(
  DtChartSelectionAreaBase
);

@Component({
  selector: 'dt-chart-selection-area',
  templateUrl: './chart-selection-area.html',
  styleUrls: ['./chart-selection-area.scss'],
  inputs: ['disabled'],
})
export class DtChartSelectionArea extends _DtChartSelectionAreaBaseMixin
  implements CanDisable, OnDestroy {
  _rangeStyle$: Observable<Partial<CSSStyleDeclaration>> = EMPTY;

  private _host: HTMLElement = this._elementRef.nativeElement;
  private _mode: 'timestamp' | 'range' | 'both' = 'both';
  private _disableRange = false;
  private _disableTimestamp = true;

  private _destroy$ = new Subject<void>();

  @ContentChildren(DtChartSelectionArea, {})
  _timestamp: QueryList<DtChartSelectionAreaTimestamp>;

  @ContentChild(DtChartSelectionAreaTimestamp)
  _range: DtChartSelectionAreaRange;

  @Input()
  get mode(): 'timestamp' | 'range' | 'both' {
    return this._mode;
  }
  set mode(value: 'timestamp' | 'range' | 'both') {
    switch (value) {
      case 'timestamp':
        this._disableRange = true;
      case 'range':
        this._disableTimestamp = false;
      default:
        this._disableRange = false;
        this._disableTimestamp = false;
    }

    this._mode = value;
  }

  constructor(
    @SkipSelf() public _chart: DtChart,
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {
    super();
    // TODO: create observables only when platform browser
    const mousedown$ = fromEvent<MouseEvent>(this._host, 'mousedown').pipe(
      filter((event) => event.button === 0), // only emit left mouse
      filter(() => !this.disabled),
      share()
    );

    const mousemove$ = fromEvent<MouseEvent>(window, 'mousemove').pipe(
      filter(() => !this.disabled),
      share()
    );

    const mouseup$ = fromEvent<MouseEvent>(window, 'mouseup').pipe(
      filter(() => !this.disabled),
      share()
    );

    const drag$ = mousedown$.pipe(
      filter(() => !this._disableRange),
      switchMap(() => mousemove$.pipe(takeUntil(mouseup$))),
      share()
    );

    const click$ = merge(mousedown$, mousemove$, mouseup$).pipe(
      pairwise(),
      filter(([a, b]) => a.type === 'mousedown' && b.type === 'mouseup'),
      map(([a, b]) => b),
      share()
    );

    const currentMousePosition$: Observable<MousePosition> = mousedown$.pipe(
      map((event: MouseEvent) => getRelativeMousePosition(event, this._host))
    );

    const showRange$ = drag$.pipe(mapTo(1));
    const hideRange$ = mousedown$.pipe(mapTo(0));
    const opacity$ = merge(showRange$, hideRange$).pipe(distinctUntilChanged());

    this._rangeStyle$ = combineLatest(
      drag$,
      opacity$,
      currentMousePosition$
    ).pipe(
      createRange(this._host),
      share()
    );


    click$.pipe(takeUntil(this._destroy$)).subscribe((event: MouseEvent) => {
      this._setTimestampPosition(event);
    });

    mousedown$.pipe(takeUntil(this._destroy$)).subscribe((items) => {});
    mouseup$.pipe(takeUntil(this._destroy$)).subscribe((items) => {});

    this._chart._afterRender.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._setPosition();
    });

    this._ngZone.runOutsideAngular(() => {
      drag$.pipe(takeUntil(this._destroy$)).subscribe(() => {
        this._onDrag();
      });
    });
  }

  ngAfterContentInit(): void {
    console.log(this._timestamp);
    // this._timestamp.changes.
    // .pipe(

    // ).subscribe(console.log)
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal */
  _rangeHandleDragStart(mouseEvent: MouseEvent): void {
    // const mousedown$ = of(mouseEvent);
    // // const mouseup$ = fromEvent<MouseEvent>(window, 'mouseup').pipe(
    // //   filter(() => !this.disabled),
    // //   share()
    // // );
    // const mousemove$ = fromEvent<MouseEvent>(window, 'mousemove').pipe(
    //   filter(() => !this.disabled),
    //   share()
    // );

    // // const dragging$ = mousedown$.pipe(
    // //   filter(() => !this._disableRange),
    // //   switchMap(() => mousemove$.pipe(takeUntil(mouseup$))),
    // //   share()
    // // );

    // const currentMousePosition$: Observable<MousePosition> = mousedown$.pipe(
    //   map((event: MouseEvent) => getRelativeMousePosition(event, this._host))
    // );

    // this._rangeStyle$ = combineLatest(
    //   this._rangeStyle$,
    //   mousemove$,
    //   currentMousePosition$
    // ).pipe(
    //   updateRange(this._host),
    //   share()
    // );

    // this._rangeStyle$.subscribe(console.log)
  }

  /** Set the position of the select-able area to the size of the highcharts plot background */
  private _setPosition(): void {
    const chartElement: HTMLElement = this._chart.container.nativeElement;
    const referenceElement: SVGRectElement | null = chartElement.querySelector(
      HIGHCHARTS_PLOT_BACKGROUND
    );
    if (!referenceElement) {
      // TODO: move error message to a global place
      throw Error('No plot background found!');
    }

    // get Bounding client Rects of the plot background and the host to calculateRelativeXPos
    // a relative offset.
    const hostBCR = this._host.getBoundingClientRect();
    const plotBCR = referenceElement.getBoundingClientRect();

    const topOffset = plotBCR.top - hostBCR.top;
    const leftOffset = plotBCR.left - hostBCR.left;

    setPosition(this._host, {
      top: topOffset,
      left: leftOffset,
      width: plotBCR.width,
      height: plotBCR.height,
    });
  }

  /** Set the timestamp on the x-axis position of the provided event */
  private _setTimestampPosition(event: MouseEvent): void {
    const mousePosition = getRelativeMousePosition(event, this._host);
    this._timestamp._setPosition(mousePosition.x);
    this._timestamp._show();
  }

  private _onDrag(): void {
    this._timestamp._hide();
    // console.log('dragging!');
  }
}

// export type updateRangeInput = [Partial<CSSStyleDeclaration>, MouseEvent {x: number; y: number}];

// export const updateRange = (container: HTMLElement) => (
//   source: Observable<updateRangeInput>
// ): Observable<Partial<CSSStyleDeclaration>> =>
//   source.pipe(
//     map(([displayStyle, event, { x, y }]) => {
//       const mousePosition: MousePosition = getRelativeMousePosition(
//         event,
//         container
//       );

//       const width = mousePosition.x - x;

//       // const bcr = container.getBoundingClientRect();
//       // const left = width < 0 ? mousePosition.x : x;
//         console.log(displayStyle)
//       return {
//         ...displayStyle,
//         // left: `${left}px`,
//         // width: `${Math.abs(width)}px`,
//         // opacity: `${opacity}`,
//       };
//     })
//   );

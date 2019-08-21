import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  DomPortalOutlet,
  PortalOutlet,
  TemplatePortal,
} from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ContentChildren,
  ElementRef,
  Inject,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { ScaleLinear, ScaleTime, scaleLinear, scaleTime } from 'd3-scale';
import { line } from 'd3-shape';
import { Subject, merge } from 'rxjs';
import {
  startWith,
  switchMap,
  switchMapTo,
  take,
  takeUntil,
} from 'rxjs/operators';

import { DtViewportResizer } from '@dynatrace/angular-components/core';

import {
  DT_EVENT_CHART_COLORS,
  DtEventChartColors,
  DtEventChartEvent,
  DtEventChartLane,
  DtEventChartLegendItem,
} from './event-chart-directives';

const EVENT_BUBBLE_SIZE = 16;
const EVENT_BUBBLE_SPACING = 4;
// const EVENT_BUBBLE_OVERLAP_THRESHOLD = EVENT_BUBBLE_SIZE / 2;
const TICK_HEIGHT = 24;

// tslint:disable-next-line: no-magic-numbers
const LANE_HEIGHT = EVENT_BUBBLE_SIZE * 3;

let patternDefsOutlet: PortalOutlet;

interface RenderEvent {
  x1: number;
  x2: number;
  y: number;
  color: DtEventChartColors;
  event: DtEventChartEvent;
  mergeCount: number;
}

// tslint:disable: template-cyclomatic-complexity
@Component({
  moduleId: module.id,
  selector: 'dt-event-chart, dt-sausage-chart',
  exportAs: 'dtEventChart',
  templateUrl: 'event-chart.html',
  styleUrls: ['event-chart.scss'],
  host: {
    class: 'dt-event-chart',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtEventChart implements AfterContentInit, OnInit, OnDestroy {
  /** THIS IS FOR DEBUGGING PURPOSES - REMOVE BEFORE SHIPPING */
  @Input()
  get merge(): boolean {
    return this._merge;
  }
  set merge(value: boolean) {
    this._merge = coerceBooleanProperty(value);
  }
  private _merge = false;

  /** @internal */
  @ContentChildren(DtEventChartEvent)
  _events: QueryList<DtEventChartEvent>;

  /** @internal */
  @ContentChildren(DtEventChartLane)
  _lanes: QueryList<DtEventChartLane>;

  /** @internal */
  @ContentChildren(DtEventChartLegendItem)
  _legendItems: QueryList<DtEventChartLegendItem>;

  /** @internal */
  @ViewChild('canvas', { static: true })
  _canvasEl: ElementRef;

  /** @internal */
  @ViewChild('laneLabels', { static: true })
  _laneLabelsEl: ElementRef;

  /** @internal */
  @ViewChild('patternDefs', { static: true })
  _patternDefsTemplate: TemplateRef<{ $implicit: string[] }>;

  /** @internal */
  _renderLanes: { y: number; lane: DtEventChartLane }[] = [];

  /** @internal */
  _renderEvents: RenderEvent[] = [];

  /** @internal */
  _renderPath: string | null = null;

  /** @internal */
  _renderTicks: { x: number; value: string }[] = [];

  /** @internal The with of the SVG. */
  _svgWidth = 0;

  /** @internal The height of the SVG. */
  _svgHeight = 0;

  /** @internal The height of the SVG. */
  _svgPlotHeight = 0;

  /** @internal The viewBox of the SVG. Starts at 0/0 and ends at a calculated width and height. */
  _svgViewBox: string;

  private _destroy$ = new Subject<void>();

  constructor(
    private _resizer: DtViewportResizer,
    private _changeDetectorRef: ChangeDetectorRef,
    private _zone: NgZone,
    private _viewContainerRef: ViewContainerRef,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _injector: Injector,
    // tslint:disable-next-line: no-any
    @Inject(DOCUMENT) private _document: any,
  ) {}

  ngOnInit(): void {
    this._tryCreatePatternDefs();
  }

  ngAfterContentInit(): void {
    const eventChanges$ = this._events.changes.pipe(
      takeUntil(this._destroy$),
      switchMap(() =>
        merge(...this._events.map(e => e._stateChanges$)).pipe(startWith(null)),
      ),
    );

    const laneChanges$ = this._lanes.changes.pipe(
      takeUntil(this._destroy$),
      switchMap(() =>
        merge(...this._lanes.map(e => e._stateChanges$)).pipe(startWith(null)),
      ),
    );

    this._legendItems.changes.subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });

    const contentChanges$ = merge(eventChanges$, laneChanges$).pipe(
      startWith(null),
      takeUntil(this._destroy$),
    );

    // As we need to render the lane labels, which are content children,
    // before the actual render of the SVG we need make angular recognize
    // that content children did change, so they are alway checked in the main CD cycle.
    contentChanges$.subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });

    merge(contentChanges$, this._resizer.change())
      .pipe(
        // Shift the updating/rendering of the SVG to the next CD cycle,
        // because we need the dimensions of the labels first, which are rendered in the main cycle.
        switchMapTo(this._zone.onStable.pipe(take(1))),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._update();
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _update(): void {
    const [min, max] = this._getMinMaxValuesOfEvents();
    // Note: Do not move update calls.
    // The call order is important!
    this._updateDimensions();
    this._updateRenderLanes();
    this._updateRenderEvents(min, max);
    this._updateRenderPath();
    this._updateTicks(min, max);
    this._changeDetectorRef.detectChanges();
  }

  /** Updates the dimensions of the SVG itself, its plot area and the view box. */
  private _updateDimensions(): void {
    const canvasEl = this._canvasEl.nativeElement as HTMLElement;
    if (canvasEl) {
      const canvasWidth = canvasEl.clientWidth;
      // tslint:disable-next-line: no-magic-numbers
      this._svgPlotHeight = this._lanes.length * LANE_HEIGHT + 3;
      this._svgHeight = this._svgPlotHeight + TICK_HEIGHT;
      this._svgWidth = canvasWidth;
      this._svgViewBox = `0 0 ${canvasWidth} ${this._svgHeight}`;
    }
  }

  /** Updates the lane objects that are actually used for rendering. */
  private _updateRenderLanes(): void {
    let y = 1;
    this._renderLanes = this._lanes
      .map(lane => {
        const renderLane = { lane, y };
        y += LANE_HEIGHT + 1;
        return renderLane;
      })
      .reverse();
  }

  /** Updates the event objects that are actually used for rendering. */
  private _updateRenderEvents(min: number, max: number): void {
    const events = this._events.toArray();
    const scale = this._getScaleForEvents(min, max);

    const renderEvents: RenderEvent[] = [];
    for (const event of events) {
      const lane = this._getLaneByName(event.lane);
      if (lane) {
        const lanePos = this._getLanePosition(lane);
        if (lanePos !== -1) {
          // The Y of a bubble is the sum of all lane heights
          // before the lane where the bubble is located
          // plus half of the height of the current lane.
          // tslint:disable-next-line: no-magic-numbers
          const y = lanePos * (LANE_HEIGHT + 1) + LANE_HEIGHT / 2;

          const x1 = scale(event.value);
          let x2 = x1;

          // If the event has a duration the event is a sausage instead of a single point,
          // which means we need to calculate the x value of the events end.
          if (event.duration) {
            x2 = scale(event.value + event.duration);
          }

          // if (this._merge) {
          //   if (prevEvent && prevEvent.event.lane === event.lane) {
          //     const overlap = x - prevEvent.x;
          //     if (overlap <= EVENT_BUBBLE_OVERLAP_THRESHOLD) {
          //       console.log(event);
          //       // prevEvent.mergeCount += 1;
          //       // continue;
          //     }
          //   }
          // }

          renderEvents.push({
            x1,
            x2,
            y,
            color: lane.color,
            event,
            mergeCount: 0,
          });
        }
      }
    }

    this._renderEvents = renderEvents;
  }

  /** Generates and updates the path that connects all the render events. */
  private _updateRenderPath(): void {
    const points: [number, number][] = [];
    for (const renderEvent of this._renderEvents) {
      points.push([renderEvent.x1, renderEvent.y]);
      if (renderEvent.x1 !== renderEvent.x2) {
        points.push([renderEvent.x2, renderEvent.y]);
      }
    }
    this._renderPath = line()(points);
  }

  /** Generates and updates the ticks for the x-axis. */
  private _updateTicks(min: number, max: number): void {
    const timeScale = this._getTimeScaleForEvents(min, max);
    const dateTicks = timeScale.ticks();
    this._renderTicks = dateTicks.map(date => {
      const timestamp = date.getTime();
      return {
        x: timeScale(timestamp),
        // TODO @thomas.pink, @thomas.heller:
        // Investigate if we should move the time formatting to a pipe
        value: formatRelativeTimestamp(timestamp),
      };
    });
  }

  /** Generate a linear scale function based on all values provided by the events. */
  private _getScaleForEvents(
    min: number,
    max: number,
  ): ScaleLinear<number, number> {
    // tslint:disable-next-line: no-magic-numbers
    const bubbleRadius = EVENT_BUBBLE_SIZE / 2;

    return scaleLinear()
      .domain([min, max])
      .range([
        bubbleRadius + 1 + EVENT_BUBBLE_SPACING,
        this._svgWidth - 1 - EVENT_BUBBLE_SPACING - bubbleRadius,
      ]);
  }

  /**
   * Generate a time based scale function based on the event values.
   * This scale function should only be used for the time based x-axis.
   * Use the _getScaleForEvents for all the other use cases
   */
  private _getTimeScaleForEvents(
    min: number,
    max: number,
  ): ScaleTime<number, number> {
    // tslint:disable-next-line: no-magic-numbers
    const bubbleRadius = EVENT_BUBBLE_SIZE / 2;
    return scaleTime()
      .domain([new Date(0), new Date(max - min)])
      .range([
        bubbleRadius + 1 + EVENT_BUBBLE_SPACING,
        this._svgWidth - 1 - EVENT_BUBBLE_SPACING - bubbleRadius,
      ])
      .nice();
  }

  /**
   * Find the minimum and maximum values of the provided events.
   * These min and max values are basically the range of the chart.
   */
  private _getMinMaxValuesOfEvents(): [number, number] {
    let min = Infinity;
    let max = -Infinity;
    if (this._events) {
      for (const event of this._events.toArray()) {
        const eventEnd = event.duration
          ? event.value + event.duration
          : event.value;
        min = event.value < min ? event.value : min;
        max = eventEnd > max ? event.value : max;
      }
    }
    return [min, max];
  }

  /** Tries to find a lane base on a provided name. */
  private _getLaneByName(name: string): DtEventChartLane | null {
    return this._lanes.find(lane => lane.name === name) || null;
  }

  /** Returns the position (reversed index) of a lane. */
  private _getLanePosition(lane: DtEventChartLane): number {
    return this._lanes
      .toArray()
      .reverse()
      .indexOf(lane);
  }

  private _tryCreatePatternDefs(): void {
    if (patternDefsOutlet || !this._document) {
      return;
    }

    const patternHost = this._document.createElement('div');
    this._document.body.appendChild(patternHost);

    const portal = new TemplatePortal(
      this._patternDefsTemplate,
      this._viewContainerRef,
      { $implicit: DT_EVENT_CHART_COLORS },
    );
    const outlet = new DomPortalOutlet(
      patternHost,
      this._componentFactoryResolver,
      this._appRef,
      this._injector,
    );

    outlet.attachTemplatePortal(portal);

    patternDefsOutlet = outlet;
  }
}

/** Formats a relative timestamp into a readable text. */
function formatRelativeTimestamp(timestamp: number): string {
  // tslint:disable: no-magic-numbers
  const sec = 1000;
  const min = sec * 60;
  const hour = min * 60;
  const day = hour * 24;
  if (timestamp >= day) {
    return `${timestamp / day}d`;
  } else if (timestamp >= hour) {
    return `${timestamp / hour}h`;
  } else if (timestamp >= min) {
    return `${timestamp / min}min`;
  } else if (timestamp >= sec) {
    return `${timestamp / sec}s`;
  }
  return `${timestamp}ms`;
  // tslint:enable: no-magic-numbers
}

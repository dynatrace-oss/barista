/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import {
  coerceBooleanProperty,
  coerceNumberProperty,
} from '@angular/cdk/coercion';
import {
  Component,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';

export type DtEventChartColors =
  | 'default'
  | 'error'
  | 'conversion'
  | 'filtered';
export const DT_EVENT_CHART_COLORS = [
  'default',
  'error',
  'conversion',
  'filtered',
];

/**
 * Selected event class.
 * An instance of this class will be emitted, when an eventBubble is clicked
 * by the user.
 */
export class DtEventChartSelectedEvent<T> {
  constructor(public sources: DtEventChartEvent<T>[]) {}
}

@Directive({
  selector:
    'ng-template[dtEventChartOverlay], ng-template[dtSausageChartOverlay]',
  exportAs: 'dtEventChartOverlay',
})
export class DtEventChartOverlay {}

@Component({
  selector: 'dt-event-chart-event, dt-sausage-chart-event',
  exportAs: 'dtEventChartEvent',
  template: '<ng-content></ng-content>',
})
export class DtEventChartEvent<T> implements OnChanges, OnDestroy {
  /** xValue of the DtEventChartEvent. Usually this is a timestamp like number. */
  @Input()
  get value(): number {
    return this._value;
  }
  set value(value: number) {
    this._value = coerceNumberProperty(value);
  }
  private _value: number;

  /**
   * Lane identifier of the DtEventChartEvent. This value determines on which
   * lane this event should be represented.
   */
  @Input() lane: string;

  /**
   * Duration of the DtEventChartEvent. If this is larger than 0, the event
   * is considered a duration / sausage event.
   */
  @Input()
  get duration(): number {
    return this._duration;
  }
  set duration(value: number) {
    this._duration = coerceNumberProperty(value);
  }
  private _duration = 0;

  /**
   * Determines the current color of a single event. Either being default,
   * error or filtered.
   */
  @Input() color: DtEventChartColors | undefined;

  /**
   * Data of the event. This can be freely given and the data will be exposed
   * to the consumer, when the event is clicked or passed through to the
   * implicit overlay context.
   */
  @Input() data: T;

  /** Emits when event is selected. */
  @Output() readonly selected = new EventEmitter<
    DtEventChartSelectedEvent<T>
  >();

  /**
   * @internal
   * Subject that fires when either of the inputs changes, the
   * dtEventChart will subscribe to a collection of these stateChanges
   * events to react to changes in the data of DtEventChartEvents.
   */
  _stateChanges$ = new Subject<void>();

  ngOnChanges(): void {
    this._stateChanges$.next();
  }

  ngOnDestroy(): void {
    this._stateChanges$.complete();
  }
}

@Directive({
  selector: 'dt-event-chart-lane, dt-sausage-chart-lane',
  exportAs: 'dtEventChartLane',
})
export class DtEventChartLane implements OnChanges, OnDestroy {
  /**
   * Defines the name of the lane. This name is being used to associate
   * the EventChartEvents with this lane.
   */
  @Input() name: string;

  /**
   * Defines the label of this lane. The lane label will be rendered next to
   * the lane in the chart.
   */
  @Input() label: string;

  /**
   * Defines the default color for this particular lane.
   * If the events assosiated with this lane do not have a color,
   * they will inherit this color provided by the lane.
   */
  @Input() color: DtEventChartColors = 'default';

  /**
   * Defines if the lane should apply a pattern to the events or not.
   */
  @Input()
  get pattern(): boolean {
    return this._pattern;
  }
  set pattern(value: boolean) {
    this._pattern = coerceBooleanProperty(value);
  }
  private _pattern = false;

  /**
   * @internal
   * Subject that fires when either of the inputs changes, the
   * dtEventChart will subscribe to a collection of these stateChanges
   * events to react to changes in the data of DtEventChartLane.
   */
  _stateChanges$ = new Subject<void>();

  ngOnChanges(): void {
    this._stateChanges$.next();
  }

  ngOnDestroy(): void {
    this._stateChanges$.complete();
  }
}

@Component({
  selector: 'dt-event-chart-legend-item, dt-sausage-chart-legend-item',
  exportAs: 'dtEventChartLegendItem',
  template: '<ng-template><ng-content></ng-content></ng-template>',
})
export class DtEventChartLegendItem implements OnChanges, OnDestroy {
  /**
   * Defines the lanes which can be associate with this legenditem.
   */
  @Input() lanes: string[] | string = [];

  /**
   * Defines if the legendItem applies to pattern events or not.
   */
  @Input()
  get pattern(): boolean {
    return this._pattern;
  }
  set pattern(value: boolean) {
    this._pattern = coerceBooleanProperty(value);
  }
  private _pattern = false;

  /** Defines the color for which this DtEventChartLegend applies. */
  @Input() color: DtEventChartColors = 'default';

  /**
   * @internal
   * Content template, which will be used to render the ng-content of
   * this component into the legend item
   */
  @ViewChild(TemplateRef, { static: true })
  _contentTemplate: TemplateRef<void>;

  /**
   * @internal
   * Subject that fires when either of the inputs changes, the
   * dtEventChart will subscribe to a collection of these stateChanges
   * events to react to changes in the data of DtEventChartLegendItem.
   */
  _stateChanges$ = new Subject<void>();

  ngOnChanges(): void {
    this._stateChanges$.next();
  }

  ngOnDestroy(): void {
    this._stateChanges$.complete();
  }
}

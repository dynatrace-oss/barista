import {
  Component,
  ContentChild,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';

export type DtEventChartColors = 'default' | 'error' | 'conversion';
export const DT_EVENT_CHART_COLORS = ['default', 'error', 'conversion'];

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
export class DtEventChartEvent implements OnChanges, OnDestroy {
  /** TODO */
  @Input() value: number;

  /** TODO */
  @Input() lane: string;

  /** TODO */
  @Input() duration = 0;

  /** @internal */
  @ContentChild(DtEventChartOverlay, { static: false, read: TemplateRef })
  _overlay: TemplateRef<void>;

  /** @internal TODO */
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
  /** TODO */
  @Input() name: string;

  /** TODO */
  @Input() label: string;

  /** TODO */
  @Input() color: DtEventChartColors = 'default';

  /** @internal TODO */
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
  /** TODO */
  @Input() lanes: string[] | string = [];

  /** @internal TODO */
  @ViewChild(TemplateRef, { static: true })
  _contentTemplate: TemplateRef<void>;

  /** @internal TODO */
  _stateChanges$ = new Subject<void>();

  ngOnChanges(): void {
    this._stateChanges$.next();
  }

  ngOnDestroy(): void {
    this._stateChanges$.complete();
  }
}

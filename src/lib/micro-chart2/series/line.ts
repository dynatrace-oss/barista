import {
  Input,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  ChangeDetectorRef,
  SimpleChanges,
  ElementRef,
  NgZone,
} from '@angular/core';
import { DtMicroChartSeriesSVG } from './series';
import { TemplatePortal } from '@angular/cdk/portal';
import { DtMicroChartLineExtremes } from '../business-logic/core/line';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { calculateLabelPosition } from '../helper-functions';
import { isDefined } from '@dynatrace/angular-components/core';

export type SVGTextAnchor = 'start' | 'middle' | 'end';

@Component({
  selector: 'g[dt-micro-chart-line-series]',
  host: {
    class: 'dt-micro-chart-series, dt-micro-chart-line-series',
  },
  templateUrl: './line.html',
  styleUrls: ['line.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DtMicroChartSeriesSVG, useExisting: DtMicroChartLineSeriesSVG },
  ],
})
export class DtMicroChartLineSeriesSVG extends DtMicroChartSeriesSVG {

  private _destroy = new Subject();

  @Input() points: Array<{ x: number; y: number }>;
  @Input() width: number;
  @Input() path: string;
  @Input() highlightExtremes = true;
  @Input() extremes: DtMicroChartLineExtremes;
  @Input() minTemplate: TemplateRef<any>;
  @Input() maxTemplate: TemplateRef<any>;
  minPortal: TemplatePortal<any>;
  maxPortal: TemplatePortal<any>;

  @ViewChild('minLabel') minLabelElementRef: ElementRef;
  @ViewChild('maxLabel') maxLabelElementRef: ElementRef;

  /** @internal Radius for the point markers. */
  _markerRadius = 4;

  /** @internal Radius for the point markers. */
  _extremeRadius = 6;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _zone: NgZone
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.highlightExtremes && this.minTemplate && this.maxTemplate) {
      this.minPortal = new TemplatePortal(this.minTemplate, this._viewContainerRef, { $implicit: this.extremes.minValue });
      this.maxPortal = new TemplatePortal(this.maxTemplate, this._viewContainerRef, { $implicit: this.extremes.maxValue });
      this._zone.onStable.pipe(
          takeUntil(this._destroy),
          take(1)
        ).subscribe(() => this._setExtremeLabelPosition());
    }
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  /** Calculate exteme label position */
  private _setExtremeLabelPosition(): void {
    if (this.minLabelElementRef && this.extremes && this.extremes.min && isDefined(this.extremes.min.x)) {
      const minLabelLength = this.minLabelElementRef.nativeElement.getComputedTextLength();
      this.minLabelElementRef.nativeElement
        .setAttribute('text-anchor', calculateLabelPosition(this.extremes.min.x!, minLabelLength, this.width));
    }
    if (this.maxLabelElementRef && this.extremes && this.extremes.max && isDefined(this.extremes.min.x)) {
      const maxLabelLength = this.maxLabelElementRef.nativeElement.getComputedTextLength();
      this.maxLabelElementRef.nativeElement
        .setAttribute('text-anchor', calculateLabelPosition(this.extremes.max.x!, maxLabelLength, this.width));
    }
  }
}

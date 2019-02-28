import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  NgZone,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  OnChanges,
} from '@angular/core';
import { DtMicroChartSeriesSVG } from './series';
import { Subject } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntil, take } from 'rxjs/operators';
import { calculateLabelPosition } from '../helper-functions';
import { isDefined } from '@dynatrace/angular-components';
import { DtMicroChartColumnDataPoint } from '../business-logic/core/column';
import { DtMicroChartExtremes } from '../business-logic/core/chart';

@Component({
  selector: 'g[dt-micro-chart-column-series]',
  host: {
    class: 'dt-micro-chart-series, dt-micro-chart-column-series',
  },
  templateUrl: 'column.html',
  styleUrls: ['column.scss'],
  inputs: ['stacked'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DtMicroChartSeriesSVG, useExisting: DtMicroChartColumnSeriesSVG },
  ],
})
export class DtMicroChartColumnSeriesSVG extends DtMicroChartSeriesSVG implements OnChanges, OnDestroy {

  private _destroy = new Subject();

  @Input() points: Array<{ x: number; y: number; height: number; width: number }>;
  @Input() width: number;
  @Input() plotOffsetX = 0;
  @Input() highlightExtremes = false;
  @Input() extremes: DtMicroChartExtremes<DtMicroChartColumnDataPoint>;
  @Input() minTemplate: TemplateRef<any>;
  @Input() maxTemplate: TemplateRef<any>;
  @Input() minHighlightRectangle: DtMicroChartColumnDataPoint;
  @Input() maxHighlightRectangle: DtMicroChartColumnDataPoint;

  minPortal: TemplatePortal<any>;
  maxPortal: TemplatePortal<any>;

  @ViewChild('minLabel') minLabelElementRef: ElementRef;
  @ViewChild('maxLabel') maxLabelElementRef: ElementRef;

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
    if (this.minLabelElementRef && this.extremes && this.extremes.minAnchor && isDefined(this.extremes.minAnchor.x)) {
      const minLabelLength = this.minLabelElementRef.nativeElement.getComputedTextLength();
      const minLabelTextAnchor = calculateLabelPosition(this.extremes.minAnchor.x! + this.plotOffsetX, minLabelLength, this.width);
      this.minLabelElementRef.nativeElement.setAttribute('text-anchor', minLabelTextAnchor);
    }
    if (this.maxLabelElementRef && this.extremes && this.extremes.maxAnchor && isDefined(this.extremes.maxAnchor.x)) {
      const maxLabelLength = this.maxLabelElementRef.nativeElement.getComputedTextLength();
      const maxLabelTextAnchor = calculateLabelPosition(this.extremes.maxAnchor.x! + this.plotOffsetX, maxLabelLength, this.width);
      this.maxLabelElementRef.nativeElement.setAttribute('text-anchor', maxLabelTextAnchor);
    }
  }
}

import { DtMicroChartSeriesSVG } from './series';
import { Input, TemplateRef, ViewChild, ElementRef, OnDestroy, OnChanges, SimpleChanges, ViewContainerRef, NgZone } from '@angular/core';
import { DtMicroChartExtremes } from '../business-logic/core/chart';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntil, take } from 'rxjs/operators';
import { calculateLabelPosition } from '../helper-functions';
import { isDefined } from '../../core';

/** Class that extends the DtMicroChartSeries and extends the possibility to add Highlighting of extremes */
export class DtMicroChartExtremeSeriesSVG<T> extends DtMicroChartSeriesSVG implements OnChanges, OnDestroy {
  /** Width of the plot area/chart */
  @Input() width: number;

  /** PlotOffset to the left border of the chart. Corresponds to the margin-left. */
  @Input() plotOffsetX = 0;

  /** Boolean flag whether or not extremes should be rendered. */
  @Input() highlightExtremes = false;

  /** Extreme data containing min/max values, min/max Anchors for labels and dataPoints. */
  @Input() extremes: DtMicroChartExtremes<T>;

  /** Template ref for the minimum label content projection. */
  // tslint:disable-next-line:no-any
  @Input() minTemplate: TemplateRef<any>;

  /** Template ref for the maximum label content projection. */
  // tslint:disable-next-line:no-any
  @Input() maxTemplate: TemplateRef<any>;

  /** Template portals for the minimum label content projection. */
  _minPortal: TemplatePortal;

  /** Template portals for the maximum label content projection. */
  _maxPortal: TemplatePortal;

  /** @internal Element reference for the minimum Label. Needed for rendering the label into the svg */
  @ViewChild('minLabel') _minLabelElementRef: ElementRef;

  /** @internal Element reference for the maximum Label. Needed for rendering the label into the svg */
  @ViewChild('maxLabel') _maxLabelElementRef: ElementRef;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _zone: NgZone
  ) {
    super();
  }

  /** On changes */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.highlightExtremes && this.minTemplate && this.maxTemplate) {
      this._minPortal = new TemplatePortal(this.minTemplate, this._viewContainerRef, { $implicit: this.extremes.minValue });
      this._maxPortal = new TemplatePortal(this.maxTemplate, this._viewContainerRef, { $implicit: this.extremes.maxValue });
      this._zone.onStable.pipe(
          takeUntil(this._destroy),
          take(1)
        ).subscribe(() => { this._setExtremeLabelPosition(); });
    }
  }

  /** Set the anchor positions for the minimum and maximum label to ensure the labels are positioned in the visible plot. */
  private _setExtremeLabelPosition(): void {
    if (this._minLabelElementRef && this.extremes && this.extremes.minAnchor && isDefined(this.extremes.minAnchor.x)) {
      const minLabelLength = this._minLabelElementRef.nativeElement.getComputedTextLength();
      const minLabelTextAnchor = calculateLabelPosition(this.extremes.minAnchor.x + this.plotOffsetX, minLabelLength, this.width);
      // We set the text-anchor attribute directly on the element to prevent an additional ChangeDetection cycle.
      this._minLabelElementRef.nativeElement.setAttribute('text-anchor', minLabelTextAnchor);
    }
    if (this._maxLabelElementRef && this.extremes && this.extremes.maxAnchor && isDefined(this.extremes.maxAnchor.x)) {
      const maxLabelLength = this._maxLabelElementRef.nativeElement.getComputedTextLength();
      const maxLabelTextAnchor = calculateLabelPosition(this.extremes.maxAnchor.x + this.plotOffsetX, maxLabelLength, this.width);
      // We set the text-anchor attribute directly on the element to prevent an additional ChangeDetection cycle.
      this._maxLabelElementRef.nativeElement.setAttribute('text-anchor', maxLabelTextAnchor);
    }
  }
}

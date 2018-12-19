import { Directive, Input, NgZone, ElementRef, OnDestroy, Attribute, Host, Renderer2, SimpleChanges, OnChanges } from '@angular/core';
import { DtViewportResizer, addCssClass, HasTabIndex, CanDisable } from '@dynatrace/angular-components/core';
import { DtSelectionArea, DtSelectionAreaOrigin } from '@dynatrace/angular-components/selection-area';
import { DtChart } from '../chart';
import { takeUntil, map, filter } from 'rxjs/operators';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';

@Directive({
  selector: 'dt-chart[dtChartSelectionArea]',
  exportAs: 'dtChartSelectionAreaOrigin',
  host: {
    class: 'dt-selection-area-origin',
  },
  inputs: ['tabIndex'],
})
export class DtChartSelectionAreaOrigin extends DtSelectionAreaOrigin
  implements OnDestroy, OnChanges, HasTabIndex, CanDisable {

  /** The selection area instance to be connected to this origin  */
  @Input('dtChartSelectionArea') selectionArea: DtSelectionArea;

  /** The plotbackground that is used as the origin */
  private _plotBackground: SVGRectElement;
  /** Array of unregister functions on the window */
  private _detachFns: Array<() => void> = [];
  /** The Subscription for the close observable */
  private _selectionAreaClosedSub = Subscription.EMPTY;

  constructor(
    _zone: NgZone,
    _elementRef: ElementRef,
    _viewport: DtViewportResizer,
    private _renderer: Renderer2,
    @Host() private _chart: DtChart,
    @Attribute('tabindex') tabIndex: string
  ) {
    super(_zone, _elementRef, _viewport, tabIndex);

    this.tabIndex = parseInt(tabIndex, 10) || 0;

    this._chart._afterRender.pipe(takeUntil(this._destroy)).subscribe(() => {
      this._plotBackground = this._chart.container.nativeElement.querySelector('.highcharts-plot-background');
      addCssClass(this._plotBackground, 'dt-selection-area-origin');
      this._plotBackground.setAttribute('tabindex', this.tabIndex.toString());
      // this needs to be done after the zone is stable because only
      // when its stable we get a correct clientrect with the correct bounds
      _zone.onStable.pipe(takeUntil(this._destroy))
        .subscribe(() => { this.selectionArea._boundariesChanged.next(this._getPlotBackgroundClientRect()); });
      this._setInterpolateFnOnSelectionArea();

      if (!this._detachFns.length) {
        this._detachFns.push(this._renderer.listen(this._plotBackground, 'mousedown', (ev) => {
          this._chart._toggleTooltip(false);
          this._handleMousedown(ev);
        }));
        this._detachFns.push(this._renderer.listen(this._plotBackground, 'keydown', (ev) => {
          this._chart._toggleTooltip(false);
          this._handleKeyDown(ev);
        }));
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectionArea) {
      this._setInterpolateFnOnSelectionArea();
      this._selectionAreaClosedSub.unsubscribe();
      this.selectionArea.closed.pipe(takeUntil(this._destroy)).subscribe(() => {
        this._chart._toggleTooltip(true);
      });
    }
  }

  ngOnDestroy(): void {
    this._detachFns.forEach((fn) => { fn(); });
    this._selectionAreaClosedSub.unsubscribe();
  }

  /** Sets the focus for the selection area origin */
  focus(): void {
    if (this._plotBackground) {
      this._plotBackground.focus();
    }
  }

  private _getPlotBackgroundClientRect(): DOMRect | null {
    if (this._plotBackground) {
      return this._plotBackground.getBoundingClientRect() as DOMRect;
    }
    return null;
  }

  private _setInterpolateFnOnSelectionArea(): void {
    if (this._chart._chartObject && this.selectionArea) {
      this.selectionArea._setInterpolateFnOnContainer(
        (pxValue: number) => this._chart._chartObject.xAxis[0].toValue(pxValue, true));
    }
  }
}

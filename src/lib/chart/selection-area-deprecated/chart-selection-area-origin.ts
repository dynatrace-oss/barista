import {
  Directive,
  Input,
  NgZone,
  ElementRef,
  OnDestroy,
  Attribute,
  Host,
  Renderer2,
  SimpleChanges,
  OnChanges,
  AfterViewInit,
} from '@angular/core';
import {
  DtViewportResizer,
  addCssClass,
  HasTabIndex,
  CanDisable,
  hasCssClass,
} from '@dynatrace/angular-components/core';
import {
  DtSelectionArea,
  DtSelectionAreaOrigin,
} from '@dynatrace/angular-components/selection-area';
import { DtChart } from '../chart';
import { takeUntil, switchMap, take } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { getDtChartSelectionAreaDateTimeAxisError } from './chart-selection-area-errors';

/**
 * @deprecated The selection area will be replaced with the chart selection area
 * @breaking-change To be removed with 5.0.0.
 */
@Directive({
  selector: 'dt-chart[dtChartSelectionArea]',
  exportAs: 'dtChartSelectionAreaOrigin',
  host: {
    class: 'dt-selection-area-origin',
  },
  inputs: ['tabIndex'],
})
// tslint:disable-next-line: deprecation
export class DtChartSelectionAreaOrigin extends DtSelectionAreaOrigin
  implements OnDestroy, OnChanges, HasTabIndex, CanDisable, AfterViewInit {
  /** The selection area instance to be connected to this origin  */
  // tslint:disable-next-line: deprecation
  @Input('dtChartSelectionArea') selectionArea: DtSelectionArea;

  /** The plotbackground that is used as the origin */
  private _plotBackground: SVGRectElement;
  /** Array of unregister functions on the window */
  private _detachFns: Array<() => void> = [];
  /** The Subscription for the close observable */
  private _selectionAreaClosedSub = Subscription.EMPTY;

  private _afterChartRender: Observable<void>;

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

    this._afterChartRender = this._chart._afterRender.pipe(
      takeUntil(this._destroy)
    );

    this._afterChartRender.subscribe(() => {
      if (this._chart._chartObject) {
        const xAxis = this._chart._chartObject.xAxis[0];
        // tslint:disable-next-line:no-any
        if (!(xAxis as any).isDatetimeAxis) {
          // tslint:disable-next-line: deprecation
          throw getDtChartSelectionAreaDateTimeAxisError();
        }
      }

      this._applyAttributesAndClassesToPlotBackground();

      this._setInterpolateFnOnSelectionArea();

      if (!this._detachFns.length) {
        this._detachFns.push(
          this._renderer.listen(
            _elementRef.nativeElement,
            'mousedown',
            (ev: MouseEvent) => {
              const hitElements = document.elementsFromPoint(
                ev.clientX,
                ev.clientY
              );
              const clickIsInsidePlotBackground = hitElements.some((el) =>
                hasCssClass(el, 'highcharts-plot-background')
              );
              if (clickIsInsidePlotBackground) {
                this._chart._toggleTooltip(false);
                this._handleMousedown(ev);
              }
            }
          )
        );
        this._detachFns.push(
          this._renderer.listen(_elementRef.nativeElement, 'keydown', (ev) => {
            this._chart._toggleTooltip(false);
            this._handleKeyDown(ev);
          })
        );
      }
    });

    // this needs to be done after the zone is stable because only
    // when its stable we get a correct clientrect with the correct bounds
    this._afterChartRender
      .pipe(switchMap(() => _zone.onStable.pipe(take(1))))
      .subscribe(() => {
        this.selectionArea._boundariesChanged.next(
          this._getPlotBackgroundClientRect()
        );
      });
  }

  // We need to override this lifecycle hook here since the base component
  // has this lifecycle hook as well and would trigger a wrong event
  ngAfterViewInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectionArea) {
      this._setInterpolateFnOnSelectionArea();
      this._handleGrabbingChange();
      this._selectionAreaClosedSub.unsubscribe();
      this.selectionArea.closed.pipe(takeUntil(this._destroy)).subscribe(() => {
        this._chart._toggleTooltip(true);
      });
    }
  }

  ngOnDestroy(): void {
    this._detachFns.forEach((fn) => {
      fn();
    });
    this._selectionAreaClosedSub.unsubscribe();
  }

  /** Sets the focus for the selection area origin */
  focus(): void {
    if (this._plotBackground) {
      this._plotBackground.focus();
    }
  }

  protected _handleMousedown(ev: MouseEvent): void {
    if (this.selectionArea) {
      this.selectionArea._createSelectedArea(ev.clientX);
    }
  }

  /** Applies classes and attributes to the plotbackground for keyboard and cursor support */
  private _applyAttributesAndClassesToPlotBackground(): void {
    this._plotBackground = this._chart.container.nativeElement.querySelector(
      '.highcharts-plot-background'
    ) as SVGRectElement;
    addCssClass(this._plotBackground, 'dt-selection-area-origin-cursor');
    this._plotBackground.setAttribute('tabindex', this.tabIndex.toString());
  }

  private _getPlotBackgroundClientRect(): DOMRect | null {
    if (this._plotBackground) {
      return this._plotBackground.getBoundingClientRect() as DOMRect;
    }
    return null;
  }

  private _setInterpolateFnOnSelectionArea(): void {
    if (this._chart._chartObject && this.selectionArea) {
      this.selectionArea._setInterpolateFnOnContainer((pxValue: number) =>
        this._chart._chartObject!.xAxis[0].toValue(pxValue, true)
      );
    }
  }
}

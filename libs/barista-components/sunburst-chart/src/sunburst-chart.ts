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

import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
  ChangeDetectorRef,
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import {
  DtUiTestConfiguration,
  DT_UI_TEST_CONFIG,
  DtViewportResizer,
} from '@dynatrace/barista-components/core';
import { DtOverlay, DtOverlayRef } from '@dynatrace/barista-components/overlay';
import { DtColors } from '@dynatrace/barista-components/theming';
import { Subject, animationFrameScheduler } from 'rxjs';
import { DtSunburstChartSegment } from './sunburst-chart-segment';
import { DtSunburstChartOverlay } from './sunburst-chart.directive';
import {
  DtSunburstChartNode,
  DtSunburstChartNodeSlice,
  DtSunburstChartTooltipData,
  fillNodes,
  getNodesWithState,
  getSelectedId,
  getSelectedNodes,
  getSelectedNodesFromOutside,
  getSlices,
  getValue,
} from './sunburst-chart.util';
import { takeUntil } from 'rxjs/operators';
import { Overlay } from '@angular/cdk/overlay';

/** Minimum width of the chart */
const MIN_WIDTH = 480;

/**
 * Sunburst chart is a donut chart with multiple levels that get unfolded on click and show an overlay on hover
 */
@Component({
  selector: 'dt-sunburst-chart',
  templateUrl: 'sunburst-chart.html',
  styleUrls: ['sunburst-chart.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '(click)': '_select($event)',
  },
  exportAs: 'dtSunburstChart',
})
export class DtSunburstChart implements AfterContentInit, OnDestroy {
  /** Series input for the sunburst-chart, should be an array of nodes with their children (i.e [A,B,C]). */
  @Input()
  get series(): DtSunburstChartNode[] {
    return this._series;
  }
  set series(value: DtSunburstChartNode[]) {
    this._series = value;
    this._filledSeries = fillNodes(value);
    this._render();
  }
  private _series: DtSunburstChartNode[];

  /** Array of selected nodes */
  @Input()
  get selected(): DtSunburstChartNode[] {
    return this._selected;
  }
  set selected(value: DtSunburstChartNode[]) {
    this._selected = getSelectedNodesFromOutside(this._filledSeries, value);
    this._render();
  }
  private _selected: DtSunburstChartTooltipData[];

  /** Defines the default label displayed in the center of the sunburst-chart, if no nodes are selected. */
  @Input() noSelectionLabel: string = 'All';
  /** Sets the display mode for the sunburst-chart values to either 'percent' or 'absolute'.  */
  @Input()
  set valueDisplayMode(value: 'absolute' | 'percent') {
    this._valueAsAbsolute = value !== 'percent';
  }

  /** Event that fires when a node is clicked with an array of selected nodes (i.e [A, A.1, A.1.a])  */
  @Output() selectedChange: EventEmitter<
    DtSunburstChartNode[]
  > = new EventEmitter();

  /** @internal Overlay template */
  @ContentChild(DtSunburstChartOverlay, { static: false, read: TemplateRef })
  _overlay: TemplateRef<DtSunburstChartTooltipData>;

  /** @internal Viewchild selection of the svg */
  @ViewChild('svg') _svgEl;

  /** @internal Viewchildren selection for the slices */
  @ViewChildren(DtSunburstChartSegment) private _segments: QueryList<
    DtSunburstChartSegment
  >;

  /** Slices to be painted. Exposed so users can open overlays */
  get slices(): DtSunburstChartNodeSlice[] {
    return this._slices;
  }
  _slices: DtSunburstChartNodeSlice[] = [];

  /** @internal The chart's width based on the viewport width. */
  _width = MIN_WIDTH;

  /** @internal The chart's radius. */
  get _radius(): number {
    return this._width / 2;
  }

  // viewbox is originX originY width and height. With -width/2 -height/2 width height the center of the svg is (0,0)
  // this way we don't have to translate all the elements and it gets centered in the middle
  /** @internal viewbox representation */
  get _viewBox(): string {
    return `${-this._width / 2} ${-this._width / 2} ${this._width} ${
      this._width
    }`;
  }

  /** @internal Label of selected element to be displayed */
  _selectedLabel: string;
  /** @internal Value of selected element to be displayed */
  _selectedValue: number;
  /** @internal Relative value of selected element to be displayed */
  _selectedRelativeValue: number;
  /** @internal Marks if absolute value should be shown or percent instead */
  _valueAsAbsolute: boolean = true;

  private _filledSeries: DtSunburstChartTooltipData[];

  /** Reference to the open overlay. */
  private _overlayRef: DtOverlayRef<DtSunburstChartTooltipData> | null;

  /** @internal Destroy subject to clear subscriptions on component destroy. */
  private readonly _destroy$ = new Subject<void>();

  constructor(
    /** @breaking-change Deprecate ViewContainerRef in version 8.0.0 */
    _overlayService: Overlay,
    /** @breaking-change Deprecate ViewContainerRef in version 8.0.0 */
    _viewContainerRef: ViewContainerRef,
    private _platform: Platform,
    // TODO: remove this sanitizer when ivy is no longer opt out
    private _sanitizer: DomSanitizer,
    private _elementRef: ElementRef<HTMLElement>,
    /** @breaking-change Make the DtViewportResizer mandatory in version 8.0.0 */
    @Optional() private _resizer?: DtViewportResizer,
    /** @breaking-change Make the ChangeDetectorRef mandatory in version 8.0.0 */
    @Optional() private _changeDetectorRef?: ChangeDetectorRef,
    @Optional() @Inject(DT_UI_TEST_CONFIG) _config?: DtUiTestConfiguration,
    /** @breaking-change Make the DtOverlay mandatory in version 8.0.0 */
    @Optional() private _dtOverlayService?: DtOverlay,
  ) {}

  /** AfterContentInit hook */
  ngAfterContentInit(): void {
    this._updateDimensions();

    if (this._resizer) {
      this._resizer
        .change()
        .pipe(takeUntil(this._destroy$))
        .subscribe(() =>
          animationFrameScheduler.schedule(
            () => {
              this._updateDimensions();
              if (this._changeDetectorRef) {
                this._changeDetectorRef.markForCheck();
              }
            },
            0,
            0,
          ),
        );
    }
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** Puts the overlay in place. */
  openOverlay(node: DtSunburstChartNodeSlice): void {
    const segment = this._segments.find(
      (segm) => segm.slice.data === node.data,
    );
    if (segment) {
      const element = segment.elementRef.nativeElement as HTMLElement;
      this._revealOverlay(
        element,
        element.getBoundingClientRect().left,
        element.getBoundingClientRect().top,
        node.data,
      );
    }
  }

  /** Programmatically close the overlay. */
  closeOverlay(): void {
    if (this._overlayRef) {
      this._overlayRef.dismiss();
      this._overlayRef = null;
    }
  }

  /** @internal gets the dimensions of the component and renders */
  _updateDimensions(): void {
    if (this._platform.isBrowser) {
      this._width = Math.max(
        MIN_WIDTH,
        this._elementRef.nativeElement.getBoundingClientRect().width,
      );
      this._render();
    }
  }

  /** @internal selects a slice or unselects the current selected if no slice is given  */
  _select(event?: MouseEvent, slice?: DtSunburstChartNodeSlice): void {
    event?.stopPropagation();

    if (slice) {
      //  TODO: lukas.holzer
      // Bazel cannot resolve the extends of the interface properly and
      // throws error: Property 'data' does not exist on type 'DtSunburstChartSlice'.
      // @ts-ignore
      this._selected = getSelectedNodes(this._filledSeries, slice.data);

      this.selectedChange.emit(this._selected.map((node) => node.origin));
    } else {
      this._selected = [];

      this.selectedChange.emit([]);
    }

    this._render();
  }

  /**
   * @internal
   * Handles the mouseEnter on a slice.
   * Creates an overlay if it is necessary.
   */
  _handleOnMouseEnter(
    event: MouseEvent,
    slice: DtSunburstChartTooltipData,
  ): void {
    this._revealOverlay(
      event.target as HTMLElement,
      event.offsetX,
      event.offsetY,
      slice,
    );
  }

  /**
   * @internal
   * Handles the mouseMove on a slice.
   * Updates the position of the overlay to create a mouseFollow position
   */
  _handleOnMouseMove(event: MouseEvent): void {
    // TODO: remove this `if` once dtOverlayService is mandatory
    if (this._dtOverlayService) {
      if (this._overlayRef) {
        this._dtOverlayService._positionStrategy.setOrigin({
          x: event.clientX,
          y: event.clientY,
        });
        this._overlayRef.updatePosition();
      }
    }
  }

  /**
   * Sanitization of the custom property is necessary as, custom property assignments do not work
   * in a viewEngine setup. This can be removed with angular version 10, if ivy is no longer opt out.
   */
  _sanitizeCSS(prop: string, value: string | number | DtColors): SafeStyle {
    return this._sanitizer.bypassSecurityTrustStyle(`${prop}: ${value}`);
  }

  /** Calculates visible slices based on their state */
  private _render(): void {
    const nodesWithState = getNodesWithState(
      this._filledSeries,
      getSelectedId(this._filledSeries, this._selected),
    );
    this._slices = getSlices(nodesWithState, this._radius);

    if (this._selected && this._selected.length) {
      this._selectedLabel = this._selected.slice(-1)[0].label ?? '';
      this._selectedValue = this._selected.slice(-1)[0].value ?? 0;
      this._selectedRelativeValue =
        this._selected.slice(-1)[0].valueRelative ?? 0;
    } else {
      this._selectedLabel = this.noSelectionLabel;
      this._selectedValue = getValue(this._filledSeries);
      this._selectedRelativeValue = 1;
    }
  }

  private _revealOverlay(
    target: HTMLElement,
    x: number,
    y: number,
    slice: DtSunburstChartTooltipData,
  ): void {
    this.closeOverlay();

    // TODO: remove this `if` once dtOverlayService is mandatory
    if (this._dtOverlayService) {
      if (this._overlay && !this._overlayRef) {
        this._overlayRef = this._dtOverlayService.create<
          DtSunburstChartTooltipData
        >(target, this._overlay);
        this._dtOverlayService._positionStrategy.setOrigin({ x, y });
        this._overlayRef.updateImplicitContext(slice);
      }
    }
  }
}

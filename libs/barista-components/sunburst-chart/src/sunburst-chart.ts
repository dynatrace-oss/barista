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

import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  dtSetUiTestAttribute,
  DtUiTestConfiguration,
  DT_UI_TEST_CONFIG,
} from '@dynatrace/barista-components/core';
import { DtSunburstChartOverlay } from './sunburst-chart.directive';
import {
  DtSunburstChartTooltipData,
  DtSunburstChartNode,
  DtSunburstChartSlice,
  fillNodes,
  getNodesWithState,
  getSelectedId,
  getSelectedNodes,
  getSelectedNodesFromOutside,
  getSlices,
  getValue,
} from './sunburst-chart.util';
import { Platform } from '@angular/cdk/platform';

const OVERLAY_PANEL_CLASS = 'dt-sunburst-chart-overlay-panel';
const VIEWBOX_WIDTH = 480;
const VIEWBOX_HEIGHT = 400;

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
export class DtSunburstChart {
  // viewbox is originX originY width and height. With -width/2 -height/2 width height the center of the svg is (0,0)
  // this way we don't have to translate all the elements and it gets centered in the middle
  /** @internal viewbox representation */
  readonly _viewBox = `-${VIEWBOX_WIDTH / 2} -${VIEWBOX_HEIGHT /
    2} ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`;

  /** @internal Viewchild selection of the svg */
  @ViewChild('svg') _svgEl;

  @ContentChild(DtSunburstChartOverlay, { read: TemplateRef })
  private _overlay: TemplateRef<DtSunburstChartOverlay>;

  private _filledSeries: DtSunburstChartTooltipData[];
  /** @internal Slices to be painted */
  _slices: DtSunburstChartSlice[] = [];

  /** @internal Label of selected element to be displayed */
  _selectedLabel: string;
  /** @internal Value of selected element to be displayed */
  _selectedValue: number;
  /** @internal Relative value of selected element to be displayed */
  _selectedRelativeValue: number;
  /** @internal Marks if absolute value should be shown or percent instead */
  _labelAsAbsolute: boolean = true;

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
    this._labelAsAbsolute = value !== 'percent';
  }

  /** Event that fires when a node is clicked with an array of selected nodes (i.e [A, A.1, A.1.a])  */
  @Output() selectedChange: EventEmitter<
    DtSunburstChartNode[]
  > = new EventEmitter();

  /** Template portal for the default overlay */
  // tslint:disable-next-line: use-default-type-parameter no-any
  private _portal: TemplatePortal<any> | null;

  /** Reference to the open overlay. */
  private _overlayRef: OverlayRef;

  constructor(
    private _overlayService: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _platform: Platform,
    private _elementRef?: ElementRef<HTMLElement>,
    @Optional()
    @Inject(DT_UI_TEST_CONFIG)
    private _config?: DtUiTestConfiguration,
  ) {}

  /** @internal selects a slice or unselects the current selected if no slice is given  */
  _select(event?: MouseEvent, slice?: DtSunburstChartSlice): void {
    event?.stopPropagation();

    if (slice) {
      this._selected = getSelectedNodes(this._filledSeries, slice.data);

      this.selectedChange.emit(this._selected.map(node => node.origin));
    } else {
      this._selected = [];

      this.selectedChange.emit([]);
    }

    this._render();
  }

  /** Calculates visible slices based on their state */
  private _render(): void {
    const nodesWithState = getNodesWithState(
      this._filledSeries,
      getSelectedId(this._filledSeries, this._selected),
    );
    this._slices = getSlices(nodesWithState);

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
  /** Programmatically close the overlay. */
  closeOverlay(): void {
    this._dismissOverlay();
  }

  /** Puts the overlay in place. */
  openOverlay(node: DtSunburstChartSlice): void {
    const origin = this._getOriginFromSlice(node);

    this._dismissOverlay();
    if (origin) {
      this._createOverlay(origin, node.data);
    }
  }

  /** Creates the overlay and attaches it. */
  private _createOverlay(
    origin: { x: number; y: number },
    node: DtSunburstChartTooltipData,
  ): void {
    // If we do not have an overlay defined, we do not need to attach it
    if (!this._overlay) {
      return;
    }

    // Create the template portal
    if (!this._portal) {
      // tslint:disable-next-line: no-any
      this._portal = new TemplatePortal<any>(
        this._overlay,
        this._viewContainerRef,
        { $implicit: node },
      );
    }

    const positionStrategy = this._overlayService
      .position()
      .flexibleConnectedTo(origin)
      .setOrigin(origin)
      .withPositions([
        {
          originX: 'center',
          originY: 'center',
          overlayX: 'center',
          overlayY: 'center',
        },
      ])
      .withFlexibleDimensions(true)
      .withPush(false)
      .withGrowAfterOpen(true)
      .withViewportMargin(0)
      .withLockedPosition(false);

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      panelClass: OVERLAY_PANEL_CLASS,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });
    this._overlayRef = this._overlayService.create(overlayConfig);

    // If the portal is not yet attached to the overlay, attach it.
    if (!this._overlayRef.hasAttached()) {
      this._overlayRef.attach(this._portal);
    }
    dtSetUiTestAttribute(
      this._overlayRef.overlayElement,
      this._overlayRef.overlayElement.id,
      this._elementRef,
      this._config,
    );
  }

  /** Dismisses the overlay. */
  private _dismissOverlay(): void {
    if (this._overlayRef) {
      this._overlayRef.detach();
      this._portal = null;
    }
  }
  /**
   * Calculates the origin for the overlay based on the target of the
   * event passed into it.
   */
  private _getOriginFromSlice(
    slice: DtSunburstChartSlice,
  ): { x: number; y: number } | undefined {
    if (this._platform.isBrowser) {
      const rect: DOMRect = this._svgEl.nativeElement.getBoundingClientRect();

      // Update the position for the overlay.
      return {
        x:
          rect.left +
          rect.width / 2 +
          slice.tooltipPosition[0] * (rect.width / VIEWBOX_WIDTH),
        y:
          rect.top +
          rect.height / 2 +
          slice.tooltipPosition[1] * (rect.height / VIEWBOX_HEIGHT),
      };
    }
  }
}

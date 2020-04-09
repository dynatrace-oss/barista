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
  HostListener,
  Inject,
  Input,
  OnChanges,
  Optional,
  Output,
  SimpleChanges,
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
import { DtSunburstOverlay } from './sunburst.directive';
import {
  DtSunburstNode,
  DtSunburstNodeInternal,
  DtSunburstSlice,
  DtSunburstValueMode,
  fillNodes,
  getNodesWithState,
  getSelectedId,
  getSelectedNodes,
  getSelectedNodesFromOutside,
  getSlices,
  getValue,
} from './sunburst.util';

const OVERLAY_PANEL_CLASS = 'dt-sunburst-overlay-panel';

@Component({
  selector: 'dt-sunburst',
  templateUrl: 'sunburst.html',
  styleUrls: ['sunburst.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtSunburst implements OnChanges {
  readonly width = 480;
  readonly viewBox = '-240 -176 480 352';

  @ViewChild('svg') svgEl;

  /** @internal Template reference for the DtSunburst overlay. */
  @ContentChild(DtSunburstOverlay, { read: TemplateRef })
  // tslint:disable-next-line: no-any
  private _overlay: TemplateRef<any>;

  filledSeries: DtSunburstNodeInternal[];
  slices: DtSunburstSlice[];

  _selected: DtSunburstNodeInternal[];
  selectedLabel: string;
  selectedValue: number;
  selectedRelativeValue: number;
  labelAsAbsolute: boolean = true;

  @HostListener('click', ['$event']) onClick(ev?: MouseEvent): void {
    this.select(ev);
  }

  @Input() series: DtSunburstNode[];
  @Input() selected: DtSunburstNode[];
  @Input() noSelectionLabel: string = 'All';
  @Input() valueDisplayMode: DtSunburstValueMode = DtSunburstValueMode.ABSOLUTE;

  @Output() selectedChange: EventEmitter<DtSunburstNode[]> = new EventEmitter();

  /** Template portal for the default overlay */
  // tslint:disable-next-line: use-default-type-parameter no-any
  private _portal: TemplatePortal<any> | null;

  /** Reference to the open overlay. */
  private _overlayRef: OverlayRef;

  constructor(
    private _overlayService: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _elementRef?: ElementRef<HTMLElement>,
    @Optional()
    @Inject(DT_UI_TEST_CONFIG)
    private _config?: DtUiTestConfiguration,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.series?.currentValue !== changes.series?.previousValue) {
      this.filledSeries = fillNodes(this.series);
      this.render();
    }

    if (changes.selected?.currentValue !== changes.selected?.previousValue) {
      this._selected = getSelectedNodesFromOutside(
        this.filledSeries,
        this.selected,
      );
      this.render();
    }

    if (
      changes.valueDisplayMode?.currentValue !==
      changes.valueDisplayMode?.previousValue
    ) {
      this.labelAsAbsolute =
        this.valueDisplayMode === DtSunburstValueMode.ABSOLUTE;
    }
  }

  select(event?: MouseEvent, slice?: DtSunburstSlice): void {
    event?.stopPropagation();

    if (slice) {
      this._selected = getSelectedNodes(this.filledSeries, slice.data);

      this.selectedChange.emit(this._selected.map(node => node.origin));
    } else {
      this._selected = [];

      this.selectedChange.emit([]);
    }

    this.render();
  }

  render(): void {
    const nodesWithState = getNodesWithState(
      this.filledSeries,
      getSelectedId(this.filledSeries, this._selected),
    );
    this.slices = getSlices(nodesWithState);

    if (this._selected && this._selected.length) {
      this.selectedLabel = this._selected.slice(-1)[0].label ?? '';
      this.selectedValue = this._selected.slice(-1)[0].value ?? 0;
      this.selectedRelativeValue =
        this._selected.slice(-1)[0].valueRelative ?? 0;
    } else {
      this.selectedLabel = this.noSelectionLabel;
      this.selectedValue = getValue(this.filledSeries);
      this.selectedRelativeValue = 1;
    }
  }
  /** Programmatically close the overlay. */
  closeOverlay(): void {
    this._dismissOverlay();
  }

  /** Puts the overlay in place. */
  openOverlay(node: DtSunburstSlice): void {
    const origin = this.getOriginFromSlice(node);

    this._dismissOverlay();
    this._createOverlay(origin, node.data);
  }

  /** Creates the overlay and attaches it. */
  private _createOverlay(
    origin: { x: number; y: number },
    node: DtSunburstNodeInternal,
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
  private getOriginFromSlice(slice: DtSunburstSlice): { x: number; y: number } {
    const rect: DOMRect = this.svgEl.nativeElement.getBoundingClientRect();

    // Update the position for the overlay.
    return {
      x: rect.left + rect.width / 2 + slice.tooltipPosition[0],
      y: rect.top + rect.height / 2 + slice.tooltipPosition[1],
    };
  }
}

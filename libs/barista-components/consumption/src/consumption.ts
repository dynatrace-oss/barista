/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  Optional,
  Inject,
} from '@angular/core';

import {
  Constructor,
  isDefined,
  mixinColor,
  _readKeyCode,
  DT_UI_TEST_CONFIG,
  DtUiTestConfiguration,
  dtSetUiTestAttribute,
} from '@dynatrace/barista-components/core';

import { DtConsumptionOverlay } from './consumption-directives';

export type DtConsumptionThemePalette = 'main' | 'warning' | 'error';

class DtConsumptionBase {
  constructor(public _elementRef: ElementRef) {}
}

// prettier-ignore
const _DtConsumption = mixinColor<Constructor<DtConsumptionBase>, DtConsumptionThemePalette>(DtConsumptionBase, 'main');

const OVERLAY_PANEL_CLASS = 'dt-consumption-overlay-panel';
const OVERLAY_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
  { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' },
  { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' },
];

const KEY_RETURN = 13;

/**
 * A data visualization box with an icon, title, a progress bar with
 * value label and a description text.
 *
 * An optional overlay section is supported that is only shown when the user
 * hovers over the consumption component.
 */
@Component({
  selector: 'dt-consumption',
  exportAs: 'dtConsumption',
  templateUrl: 'consumption.html',
  styleUrls: ['consumption.scss'],
  host: {
    class: 'dt-consumption',
    '[attr.tabindex]': '_tabIndex',
    '[class.dt-consumption-focusable]': '_tabIndex >= 0',
    '(keydown)': '_toggleOverlay($event)',
    '(blur)': '_destroyOverlay()',
    '(mouseenter)': '_createOverlay()',
    '(mouseleave)': '_destroyOverlay()',
  },
  inputs: ['color'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtConsumption
  extends _DtConsumption
  implements AfterViewInit, OnDestroy
{
  /** Largest possible {@link value} for this consumption component instance. */
  @Input()
  get max(): number {
    return this._max;
  }
  set max(val: number) {
    const max = isDefined(val) ? coerceNumberProperty(val) : 0;

    if (this._max !== max) {
      this._max = max;
      this._changeDetectorRef.markForCheck();
    }
  }
  static ngAcceptInputType_max: NumberInput;

  /**
   * The currently displayed value for this consumption component instance.
   * The value must be between {@link min} and {@link min} i.e. within the
   * interval <code>[min, max]</code>).
   */
  @Input()
  get value(): number {
    return this._value;
  }
  set value(val: number) {
    const value = isDefined(val) ? coerceNumberProperty(val) : 0;

    if (this._value !== value) {
      this._value = value;
      this._changeDetectorRef.markForCheck();
    }
  }
  static ngAcceptInputType_value: NumberInput;

  /** Defines the aria-label on the progress element. */
  @Input()
  ariaLabelProgress: string;

  /** @internal Tab index */
  _tabIndex = -1;

  private _max = 0;
  private _value = 0;

  private _overlayRef: OverlayRef | null = null;

  // Note: currently we do not observe whether the overlay is added/removed dynamically
  @ContentChild(DtConsumptionOverlay, { static: true })
  private _consumptionOverlay: DtConsumptionOverlay;

  constructor(
    readonly _elementRef: ElementRef<HTMLElement>,
    private readonly _overlay: Overlay,
    private readonly _viewContainerRef: ViewContainerRef,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private _focusMonitor: FocusMonitor,
    @Optional()
    @Inject(DT_UI_TEST_CONFIG)
    private _config?: DtUiTestConfiguration,
  ) {
    super(_elementRef);
    this._focusMonitor.monitor(this._elementRef);
  }

  ngAfterViewInit(): void {
    if (this._overlayTemplate()) {
      Promise.resolve().then(() => (this._tabIndex = 0));
    }
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._destroyOverlay();
  }

  /**
   * @internal Creates and displays an overlay that displays the overlay
   * template. If no overlay template has been declared no overlay will appear.
   */
  _createOverlay(): void {
    if (this._overlayRef) {
      return; // an overlay is already being shown
    }

    const overlayTemplate = this._overlayTemplate();

    if (overlayTemplate) {
      // overlay template has already been loaded
      const portal = new TemplatePortal(
        overlayTemplate,
        this._viewContainerRef,
      );

      // Note: each OverlayConfig can only be used for one overlay instance
      this._overlayRef = this._overlay.create(this._createOverlayConfig());
      dtSetUiTestAttribute(
        this._overlayRef.overlayElement,
        this._overlayRef.overlayElement.id,
        this._elementRef,
        this._config,
      );
      this._overlayRef.attach(portal);
    }
  }

  /**
   * @internal Hides and destroys the overlay displaying the overlay template.
   */
  _destroyOverlay(): void {
    if (this._overlayRef) {
      this._overlayRef.detach();
      this._overlayRef = null;
    }
  }

  /**
   * @internal Toggles the overlay.
   */
  _toggleOverlay(keyEvent: KeyboardEvent): void {
    if (_readKeyCode(keyEvent) === KEY_RETURN) {
      if (this._overlayRef) {
        this._destroyOverlay();
      } else {
        this._createOverlay();
      }
    }
  }

  private _createOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      panelClass: OVERLAY_PANEL_CLASS,
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this._elementRef)
        .setOrigin(this._elementRef)
        .withPositions(OVERLAY_POSITIONS)
        .withFlexibleDimensions(true)
        .withPush(false)
        .withGrowAfterOpen(true)
        .withViewportMargin(0)
        .withLockedPosition(false),
    });
  }

  private _overlayTemplate(): TemplateRef<void> {
    return (
      this._consumptionOverlay && this._consumptionOverlay._overlayTemplate
    );
  }
}

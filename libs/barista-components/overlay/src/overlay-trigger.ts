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

import { FocusMonitor } from '@angular/cdk/a11y';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  Attribute,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

import {
  CanDisable,
  HasTabIndex,
  mixinDisabled,
  mixinTabIndex,
  _readKeyCode,
} from '@dynatrace/barista-components/core';

import { DtOverlay } from './overlay';
import { DtOverlayConfig } from './overlay-config';
import { DtOverlayRef } from './overlay-ref';

export class DtOverlayTriggerBase {}
export const _DtOverlayTriggerMixin = mixinTabIndex(
  mixinDisabled(DtOverlayTriggerBase),
);

@Directive({
  selector: '[dtOverlay]',
  exportAs: 'dtOverlayTrigger',
  host: {
    '(mouseenter)': '_handleMouseEnter($event)',
    '(mouseleave)': '_handleMouseLeave($event)',
    '(keydown)': '_handleKeydown($event)',
    '(click)': '_handleClick()',
    class: 'dt-overlay-trigger',
    '[attr.tabindex]': 'tabIndex',
  },
  inputs: ['disabled', 'tabIndex'],
})
export class DtOverlayTrigger<T> extends _DtOverlayTriggerMixin
  implements CanDisable, HasTabIndex, OnDestroy, AfterViewInit {
  private _content: TemplateRef<T>;
  private _config: DtOverlayConfig = new DtOverlayConfig();
  private _dtOverlayRef: DtOverlayRef<T> | null = null;
  private _moveSub = Subscription.EMPTY;

  private _hostRect: ClientRect;
  private _svgRect: ClientRect | null = null;

  /** Overlay pane containing the content */
  @Input('dtOverlay')
  get overlay(): TemplateRef<T> {
    return this._content;
  }
  set overlay(value: TemplateRef<T>) {
    this._content = value;
  }

  /** Overlay config to be applied to the overlay. */
  @Input()
  get dtOverlayConfig(): DtOverlayConfig {
    return this._config;
  }
  set dtOverlayConfig(value: DtOverlayConfig) {
    this._config = value;
  }

  constructor(
    private elementRef: ElementRef<Element>,
    private _dtOverlayService: DtOverlay,
    private _ngZone: NgZone,
    private _focusMonitor: FocusMonitor,
    @Attribute('tabindex') tabIndex: string,
    private _platform: Platform,
  ) {
    super();
    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  ngAfterViewInit(): void {
    this._updateDimensions();
  }

  /** On destroy hook to react to trigger being destroyed. */
  ngOnDestroy(): void {
    this._moveSub.unsubscribe();
    if (this._dtOverlayRef) {
      this._dtOverlayRef.dismiss();
    }
  }

  /** Focuses the trigger. */
  focus(): void {
    this._focusMonitor.focusVia(
      this.elementRef.nativeElement as HTMLElement,
      'keyboard',
    );
  }

  /** @internal MouseEnter listener function that attaches the move subscription to the mouse. */
  _handleMouseEnter(event: MouseEvent): void {
    if (!this.disabled) {
      event.stopPropagation();
      this._moveSub.unsubscribe();
      this._updateDimensions();
      this._moveSub = this._ngZone.runOutsideAngular(() =>
        fromEvent(this.elementRef.nativeElement, 'mousemove').subscribe(
          (ev: MouseEvent) => {
            this._handleMouseMove(ev);
          },
        ),
      );
    }
  }

  /** @internal MouseLeave listener function that detaches the move subscription for the overlay. */
  _handleMouseLeave(event: MouseEvent): void {
    event.stopPropagation();
    this._moveSub.unsubscribe();
    if (this._dtOverlayRef && !this._dtOverlayRef.pinned) {
      this._dtOverlayRef.dismiss();
    }
  }

  /** @internal MouseMove listener that updates the position of the overlay. */
  _handleMouseMove(event: MouseEvent): void {
    if (this._dtOverlayRef === null) {
      this._ngZone.run(() => {
        this._createOverlay();
      });
    }
    if (this._dtOverlayRef && !this._dtOverlayRef.pinned) {
      const host = this.elementRef.nativeElement;
      const target = event.target as Element;
      const hostLeft = this._hostRect.left;
      const hostTop = this._hostRect.top;

      let offsetX = event.offsetX;
      let offsetY = event.offsetY;
      if (this._svgRect) {
        offsetX = offsetX - (hostLeft - this._svgRect.left);
        offsetY = offsetY - (hostTop - this._svgRect.top);
      }
      if (target !== host && target instanceof HTMLElement) {
        const targetRect = target.getBoundingClientRect();
        const targetLeft = targetRect.left;
        const targetTop = targetRect.top;
        offsetX = targetLeft - hostLeft + offsetX;
        offsetY = targetTop - hostTop + offsetY;
      }
      // Run a special case, if the target is an SVG.
      // Firefox gives back offsetX and offsetY when hovering on svgShapeElements
      // that are relating to the viewBox of the root svg.
      // We need to fall back to other ways of calculating the offset
      // positioning, as there is no consistency across browser vendors
      // on how they calculate offsetX and offsetY within svgShapeElements.
      if (target !== host && target instanceof SVGElement) {
        offsetX = event.clientX - hostLeft;
        offsetY = event.clientY - hostTop;
      }
      this._dtOverlayRef.updatePosition(offsetX, offsetY);
    }
  }

  /** @internal Click handler to pin an overlay. */
  _handleClick(): void {
    if (!this.disabled && this._config.pinnable && this._dtOverlayRef) {
      this._dtOverlayRef.pin(true);
    }
  }

  /** @internal Ensures the trigger is selected when activated from the keyboard. */
  _handleKeydown(event: KeyboardEvent): void {
    if (!this.disabled) {
      const keyCode = _readKeyCode(event);
      if (keyCode === ENTER || keyCode === SPACE) {
        event.preventDefault();
        this._createOverlay();
        this._dtOverlayRef!.pin(true);
      }
    }
  }

  /** Function that creates an overlay and stores the reference. */
  private _createOverlay(): void {
    if (this._content) {
      const ref = this._dtOverlayService.create<T>(
        this.elementRef,
        this._content,
        this._config,
      );
      ref.disposableFns.push(() => {
        this._dtOverlayRef = null;
      });
      this._dtOverlayRef = ref;
    }
  }

  private _updateDimensions(): void {
    if (this._platform.isBrowser) {
      const host = this.elementRef.nativeElement;
      this._hostRect = host.getBoundingClientRect();
      if (host instanceof SVGElement) {
        const svgParent = host.closest('svg');
        this._svgRect = svgParent ? svgParent.getBoundingClientRect() : null;
      } else {
        this._svgRect = null;
      }
    }
  }
}

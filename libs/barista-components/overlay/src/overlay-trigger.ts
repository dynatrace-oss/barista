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
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import {
  Attribute,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  TemplateRef,
} from '@angular/core';
import { Subscription, fromEvent, EMPTY, merge, of } from 'rxjs';
import { delay } from 'rxjs/operators';

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
export class DtOverlayTrigger<T>
  extends _DtOverlayTriggerMixin
  implements CanDisable, HasTabIndex, OnDestroy
{
  private _content: TemplateRef<T>;
  private _config: DtOverlayConfig = new DtOverlayConfig();
  private _dtOverlayRef: DtOverlayRef<T> | null = null;
  private _moveSub = Subscription.EMPTY;

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

  /** Emits on every pinned state change */
  @Output()
  pinnedChanged = new EventEmitter<boolean>();

  /** Whether the underlying overlay is pinned or not */
  get isOverlayPinned(): boolean | undefined {
    return this._dtOverlayRef?.pinned;
  }

  private _pinnedChangedSubscribtion: Subscription = EMPTY.subscribe();

  constructor(
    private elementRef: ElementRef<Element>,
    private _dtOverlayService: DtOverlay,
    private _ngZone: NgZone,
    private _focusMonitor: FocusMonitor,
    @Attribute('tabindex') tabIndex: string,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private _platform: Platform,
  ) {
    super();
    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  /** On destroy hook to react to trigger being destroyed. */
  ngOnDestroy(): void {
    this._moveSub.unsubscribe();
    if (this._dtOverlayRef) {
      this._dismissOverlay();
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
  _handleMouseEnter(enterEvent: MouseEvent): void {
    if (!this.disabled) {
      enterEvent.stopPropagation();
      this._moveSub.unsubscribe();
      this._moveSub = this._ngZone.runOutsideAngular(() =>
        merge(
          of(enterEvent).pipe(delay(0)),
          fromEvent(this.elementRef.nativeElement, 'mousemove'),
        ).subscribe((ev: MouseEvent) => {
          this._handleMouseMove(ev, enterEvent);
        }),
      );
    }
  }

  /** @internal MouseLeave listener function that detaches the move subscription for the overlay. */
  _handleMouseLeave(event: MouseEvent): void {
    event.stopPropagation();
    this._moveSub.unsubscribe();
    if (this._dtOverlayRef && !this._dtOverlayRef.pinned) {
      this._dismissOverlay();
    }
  }

  /** @internal MouseMove listener that updates the position of the overlay. */
  _handleMouseMove(event: MouseEvent, enterEvent: MouseEvent): void {
    if (this._dtOverlayRef === null) {
      this._ngZone.run(() => {
        this._createOverlay();
      });
    }
    if (this._dtOverlayRef && !this._dtOverlayRef.pinned) {
      this._dtOverlayService._positionStrategy.setOrigin({
        x:
          this._config.movementConstraint === 'yAxis'
            ? enterEvent.clientX
            : event.clientX,
        y:
          this._config.movementConstraint === 'xAxis'
            ? enterEvent.clientY
            : event.clientY,
      });
      this._dtOverlayRef.updatePosition();
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
    if (!this.disabled && this._content) {
      const keyCode = _readKeyCode(event);
      if (keyCode === ENTER || keyCode === SPACE) {
        event.preventDefault();
        this._createOverlay();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
      this._pinnedChangedSubscribtion =
        this._dtOverlayRef.pinnedChanged.subscribe((pinnedChanged) => {
          this.pinnedChanged.emit(pinnedChanged);
        });
    }
  }

  private _dismissOverlay(): void {
    this._dtOverlayRef?.dismiss();
    this._pinnedChangedSubscribtion.unsubscribe();
  }
}

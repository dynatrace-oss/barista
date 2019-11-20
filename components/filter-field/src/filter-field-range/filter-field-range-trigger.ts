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

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy,
} from '@angular/cdk/overlay';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import {
  EMPTY,
  Observable,
  Subject,
  Subscription,
  fromEvent,
  merge,
  of as observableOf,
} from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { readKeyCode } from '@dynatrace/barista-components/core';

import { DtFilterFieldRange } from './filter-field-range';

@Directive({
  selector: `input[dtFilterFieldRange]`,
  exportAs: 'dtFilterFieldRangeTrigger',
  host: {
    '(focusin)': '_handleFocus()',
    '[attr.aria-expanded]': 'rangeDisabled ? null : panelOpen.toString()',
    '[attr.aria-owns]': '(rangeDisabled || !panelOpen) ? null : range?.id',
  },
})
export class DtFilterFieldRangeTrigger implements OnDestroy {
  /** The filter-field range panel to be attached to this trigger. */
  @Input('dtFilterFieldRange')
  get range(): DtFilterFieldRange {
    return this._range;
  }
  set range(value: DtFilterFieldRange) {
    this._range = value;
    this._detachOverlay();
  }
  private _range: DtFilterFieldRange;

  /**
   * Whether the autocomplete is disabled. When disabled, the element will
   * act as a regular input and the user won't be able to open the panel.
   */
  @Input('dtFilterFieldRangeDisabled')
  get rangeDisabled(): boolean {
    return this._rangeDisabled;
  }
  set rangeDisabled(value: boolean) {
    this._rangeDisabled = coerceBooleanProperty(value);
  }
  private _rangeDisabled = false;

  /** Whether or not the filter-field range panel is open. */
  get panelOpen(): boolean {
    return (
      !!(this._overlayRef && this._overlayRef.hasAttached()) &&
      this._range.isOpen
    );
  }

  /**
   * A stream of actions that should close the autocomplete panel, including
   * when an option is selected, on blur, and when TAB is pressed.
   */
  get panelClosingActions(): Observable<null> {
    return merge(
      this._closeKeyEventStream,
      this._getOutsideClickStream(),
      this._overlayRef
        ? this._overlayRef
            .detachments()
            .pipe(
              filter(
                () => !!(this._overlayRef && this._overlayRef.hasAttached()),
              ),
            )
        : observableOf(),
    ).pipe(map(() => null));
  }

  /** Stream of keyboard events that can close the panel. */
  private readonly _closeKeyEventStream = new Subject<void>();

  /** Overlay Reference of the currently open overlay */
  private _overlayRef: OverlayRef | null;

  /** Strategy that is used to position the panel. */
  private _positionStrategy: FlexibleConnectedPositionStrategy;

  /** Whether the component has already been destroyed */
  private _componentDestroyed = false;

  /** The subscription for closing actions (some are bound to document). */
  private _closingActionsSubscription = EMPTY.subscribe();

  /**
   * Whether the autocomplete can open the next time it is focused. Used to prevent a focused,
   * closed autocomplete from being reopened if the user switches to another browser tab and then
   * comes back.
   */
  private _canOpenOnNextFocus = true;

  private _disposableFns: Array<() => void> = [];

  constructor(
    private _elementRef: ElementRef,
    private _overlay: Overlay,
    private _changeDetectorRef: ChangeDetectorRef,
    zone: NgZone,
    renderer: Renderer2,
  ) {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof window !== 'undefined') {
      zone.runOutsideAngular(() => {
        this._disposableFns.push(
          renderer.listen(window, 'blur', () => {
            // If the user blurred the window while the autocomplete is focused, it means that it'll be
            // refocused when they come back. In this case we want to skip the first focus event, if the
            // pane was closed, in order to avoid reopening it unintentionally.
            this._canOpenOnNextFocus =
              document.activeElement !== this._elementRef.nativeElement ||
              this.panelOpen;
          }),
        );
      });
    }
  }

  ngOnDestroy(): void {
    this._disposableFns.forEach(fn => {
      fn();
    });
    this._closingActionsSubscription.unsubscribe();
    this._componentDestroyed = true;
    this._destroyPanel();
    this._closeKeyEventStream.complete();
  }

  /** Opens the filter-field range panel. */
  openPanel(): void {
    if (this._range) {
      this._attachOverlay();
    }
  }

  /** Closes the filter-field range panel. */
  closePanel(shouldEmit: boolean = true): void {
    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      return;
    }

    if (this.panelOpen && shouldEmit) {
      // Only emit if the panel was visible.
      this.range.closed.emit();
    }

    this.range._isOpen = false;
    this._detachOverlay();

    // Note that in some cases this can end up being called after the component is destroyed.
    // Add a check to ensure that we don't try to run change detection on a destroyed view.
    if (!this._componentDestroyed) {
      // We need to trigger change detection manually, because
      // `fromEvent` doesn't seem to do it at the proper time.
      // This ensures that the label is reset when the
      // user clicks outside.
      this._changeDetectorRef.detectChanges();
    }
  }

  /** @internal Handles the focussing of the filter-field-range. */
  _handleFocus(): void {
    if (!this._canOpenOnNextFocus) {
      this._canOpenOnNextFocus = true;
    } else if (this._canOpen()) {
      this.openPanel();
    }
  }

  /** Determines whether the panel can be opened. */
  private _canOpen(): boolean {
    const element = this._elementRef.nativeElement;
    return !element.readOnly && !element.disabled && !this._rangeDisabled;
  }

  /** Attach the filter-field-range overlay. */
  private _attachOverlay(): void {
    if (!this._overlayRef) {
      this._overlayRef = this._overlay.create(this._getOverlayConfig());
      this._overlayRef.keydownEvents().subscribe(event => {
        const keyCode = readKeyCode(event);
        // Close when pressing ESCAPE or ALT + UP_ARROW, based on the a11y guidelines.
        // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
        if (keyCode === ESCAPE || (keyCode === UP_ARROW && event.altKey)) {
          this._closeKeyEventStream.next();
        }
      });
    }
    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      this._overlayRef.attach(this._range._portal);
      this._closingActionsSubscription = this._subscribeToClosingActions();
    }

    this.range._isOpen = this._overlayRef.hasAttached();
    this.range.opened.emit();

    if (this.panelOpen) {
      this._overlayRef.updatePosition();
    }

    this.range._markForCheck();
    this._changeDetectorRef.detectChanges();
  }

  /** Detach the filter-field-range overlay */
  private _detachOverlay(): void {
    if (this._overlayRef) {
      this._overlayRef.detach();
    }
  }

  /** Destroys the filter-field range suggestion panel. */
  private _destroyPanel(): void {
    if (this._overlayRef) {
      this.closePanel();
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  /** Returns the overlay configuration for the filter-field-range. */
  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this._getOverlayPosition(),
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
    });
  }

  /** Returns the overlay position. */
  private _getOverlayPosition(): PositionStrategy {
    this._positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this._elementRef)
      .withFlexibleDimensions(false)
      .withPush(false)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ]);

    return this._positionStrategy;
  }

  /**
   * This method listens to a stream of panel closing actions and resets the
   * stream every time the option list changes.
   */
  private _subscribeToClosingActions(): Subscription {
    return (
      this.panelClosingActions
        .pipe(take(1))
        // set the value, close the panel, and complete.
        .subscribe(() => {
          // this._setValueAndClose(event);
          this.closePanel();
        })
    );
  }

  /** Stream of clicks outside of the autocomplete panel. */
  // tslint:disable-next-line:no-any
  private _getOutsideClickStream(): Observable<Event | null> {
    if (!document) {
      return observableOf(null);
    }

    return merge(
      fromEvent<MouseEvent>(document, 'click'),
      fromEvent<TouchEvent>(document, 'touchend'),
    ).pipe(
      filter((event: Event) => {
        const clickTarget = event.target as HTMLElement;

        return (
          !!(this._overlayRef && this._overlayRef.hasAttached()) &&
          clickTarget !== this._elementRef.nativeElement &&
          !!this._overlayRef &&
          !this._overlayRef.overlayElement.contains(clickTarget)
        );
      }),
    );
  }
}

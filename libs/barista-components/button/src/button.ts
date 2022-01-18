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
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { NEVER, Subscription } from 'rxjs';

import {
  CanColor,
  CanDisable,
  Constructor,
  HasElementRef,
  mixinColor,
  mixinDisabled,
  _replaceCssClass,
} from '@dynatrace/barista-components/core';
import { DtIcon } from '@dynatrace/barista-components/icon';
import { BooleanInput } from '@angular/cdk/coercion';

export type DtButtonThemePalette = 'main' | 'warning' | 'cta';

// Boilerplate for applying mixins to DtButton.
export class DtButtonBase {
  constructor(public _elementRef: ElementRef) {}
}
export const _DtButtonMixinBase = mixinDisabled(
  mixinColor<Constructor<DtButtonBase>, DtButtonThemePalette>(
    DtButtonBase,
    'main',
  ),
);

export type ButtonVariant = 'primary' | 'secondary' | 'nested';
const defaultVariant = 'primary';

/**
 * Dynatrace design button.
 */
@Component({
  selector: `button[dt-button], button[dt-icon-button]`,
  exportAs: 'dtButton',
  host: {
    class: 'dt-button',
    '[class.dt-icon-button]': '_isIconButton',
    '[disabled]': 'disabled || null',
  },
  templateUrl: 'button.html',
  styleUrls: ['button.scss'],
  inputs: ['disabled', 'color'],
  // Removing view encapsulation so we can style tags like <sup> inside the ng-content
  // eslint-disable-next-line
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtButton
  extends _DtButtonMixinBase
  implements
    OnDestroy,
    AfterContentInit,
    CanDisable,
    CanColor<DtButtonThemePalette>,
    HasElementRef
{
  static ngAcceptInputType_disabled: BooleanInput;

  /**
   * The variant of the button.
   * It can be either 'primary', 'secondary' or 'nested'.
   */
  @Input()
  get variant(): ButtonVariant {
    return this._variant;
  }
  set variant(value: ButtonVariant) {
    const variant = value || defaultVariant;
    if (variant !== this._variant) {
      this.__replaceCssClass(variant, this._variant);
      this._variant = variant;
    }
  }
  private _variant: ButtonVariant;
  private _iconChangesSub: Subscription = NEVER.subscribe();

  /** @internal References of the icons. */
  @ContentChildren(DtIcon) _icons: QueryList<DtIcon>;

  /** @internal Whether the button is icon only. */
  _isIconButton = false;

  constructor(
    elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    super(elementRef);

    // Set the default variant to trigger the setters.
    this.variant = defaultVariant;

    this._isIconButton = this._getHostElement().hasAttribute('dt-icon-button');

    this._focusMonitor.monitor(this._elementRef.nativeElement, true);
  }

  ngAfterContentInit(): void {
    // We need to set markForCheck manually on every icons change
    // so that the template can determine if the icon container
    // should be shown or not
    this._iconChangesSub = this._icons.changes.subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
    this._iconChangesSub.unsubscribe();
  }

  /** Focuses the button. */
  focus(): void {
    this._getHostElement().focus();
  }

  /** Retrieves the native element of the host. */
  private _getHostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  private __replaceCssClass(newClass?: string, oldClass?: string): void {
    _replaceCssClass(
      this._elementRef,
      `dt-button-${oldClass}`,
      `dt-button-${newClass}`,
    );
  }
}

/**
 * Dynatrace design button.
 *
 * @design-unrelated
 */
@Component({
  selector: `a[dt-button], a[dt-icon-button]`,
  exportAs: 'dtButton, dtAnchor',
  host: {
    class: 'dt-button',
    '[class.dt-icon-button]': '_isIconButton',
    '[attr.tabindex]': 'disabled ? -1 : 0',
    '[attr.disabled]': 'disabled || null',
    '[attr.aria-disabled]': 'disabled.toString()',
    '(click)': '_haltDisabledEvents($event)',
  },
  inputs: ['disabled', 'color'],
  templateUrl: 'button.html',
  styleUrls: ['button.scss'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtAnchor extends DtButton {
  constructor(
    elementRef: ElementRef,
    focusMonitor: FocusMonitor,
    changeDetectorRef: ChangeDetectorRef,
  ) {
    super(elementRef, focusMonitor, changeDetectorRef);
  }

  /**
   * @internal Halts all events when the button is disabled.
   * This is required because otherwise the anchor would redirect to its href.
   */
  _haltDisabledEvents(event: Event): void {
    // A disabled button shouldn't apply any actions
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}

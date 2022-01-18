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
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { CanDisable, mixinDisabled } from '@dynatrace/barista-components/core';

export class DtShowMoreBase {}
const _DtShowMoreMixinBase = mixinDisabled(DtShowMoreBase);

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[dt-show-more]',
  exportAs: 'dtShowMore',
  templateUrl: 'show-more.html',
  styleUrls: ['show-more.scss'],
  host: {
    class: 'dt-show-more',
    '[class.dt-show-more-disabled]': 'disabled',
    '[class.dt-show-more-show-less]': 'showLess',
    '[attr.disabled]': 'disabled || null',
    '[attr.aria-label]': '_ariaLabel',
    '(click)': '_handleClick()',
  },
  inputs: ['disabled'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtShowMore
  extends _DtShowMoreMixinBase
  implements CanDisable, OnDestroy
{
  /** Sets the component's show less state when used as an expandable panel trigger. */
  @Input()
  get showLess(): boolean {
    return this._showLess;
  }
  set showLess(value: boolean) {
    this._showLess = coerceBooleanProperty(value);
  }
  private _showLess = false;
  static ngAcceptInputType_showLess: BooleanInput;

  /** Aria label for the show less state. */
  @Input()
  get ariaLabelShowLess(): string {
    return this._ariaLabelShowLess;
  }
  set ariaLabelShowLess(value: string) {
    this._ariaLabelShowLess = value;
  }
  private _ariaLabelShowLess = 'Show less';

  /** @internal Aria label for show less state without button text. */
  get _ariaLabel(): string | null {
    return this._showLess && this._ariaLabelShowLess
      ? this._ariaLabelShowLess
      : null;
  }

  /**
   * Emits when the show more element was clicked and notifies
   * about the changed expanded state.
   */
  @Output() readonly changed = new EventEmitter<void>();

  constructor(
    private _elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
  ) {
    super();
    this._focusMonitor.monitor(this._elementRef.nativeElement, true);
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
  }

  /** @internal Emits the change event on the show more component. */
  _handleClick(): void {
    this.changed.emit();
  }
}

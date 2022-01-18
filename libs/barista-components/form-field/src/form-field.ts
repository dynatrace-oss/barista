/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import {
  state,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  QueryList,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { EMPTY, merge, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import {
  DT_ERROR_ENTER_ANIMATION,
  DT_ERROR_ENTER_DELAYED_ANIMATION,
} from '@dynatrace/barista-components/core';

import { DtError } from './error';
import { DtFormFieldControl } from './form-field-control';
import {
  getDtFormFieldDuplicatedHintError,
  getDtFormFieldMissingControlError,
} from './form-field-errors';
import { DtHint } from './hint';
import { DtLabel } from './label';
import { DtPrefix } from './prefix';
import { DtSuffix } from './suffix';

let nextUniqueId = 0;

@Component({
  selector: 'dt-form-field',
  exportAs: 'dtFormField',
  templateUrl: 'form-field.html',
  styleUrls: ['form-field.scss'],
  host: {
    class: 'dt-form-field',
    '[class.dt-form-field-invalid]': '_control.errorState',
    '[class.dt-form-field-disabled]': '_control.disabled',
    '[class.dt-form-field-autofilled]': '_control.autofilled',
    '[class.dt-form-field-non-box]': '_control._boxControl === false',
    '[class.dt-form-field-empty]': '_control.empty',
    '[class.dt-focused]': '_control.focused',
    '[class.ng-untouched]': '_shouldForward("untouched")',
    '[class.ng-touched]': '_shouldForward("touched")',
    '[class.ng-pristine]': '_shouldForward("pristine")',
    '[class.ng-dirty]': '_shouldForward("dirty")',
    '[class.ng-valid]': '_shouldForward("valid")',
    '[class.ng-invalid]': '_shouldForward("invalid")',
    '[class.ng-pending]': '_shouldForward("pending")',
  },
  animations: [
    trigger('transitionErrors', [
      state('enter', style({ opacity: 1, transform: 'scaleY(1)' })),
      transition('void => enter', [useAnimation(DT_ERROR_ENTER_ANIMATION)]),
      transition('void => enter-delayed', [
        useAnimation(DT_ERROR_ENTER_DELAYED_ANIMATION),
      ]),
    ]),
  ],
  // We need to disable view encapsulation on the form-field so
  // are able to style label, hint, error and the control component
  // in the ng-content areas
  // eslint-disable-next-line
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtFormField<T>
  implements AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy
{
  /** @internal Unique id for the internal form field label. */
  _labelId = `dt-form-field-label-${nextUniqueId++}`;

  /** @internal State of the dt-error animations. */
  _errorAnimationState: '' | 'enter' | 'enter-delayed' = '';

  /** @internal Reference to the label */
  @ContentChild(DtLabel) _labelChild: DtLabel;

  /** @internal References to the hints */
  @ContentChildren(DtHint, { descendants: true })
  _hintChildren: QueryList<DtHint>;

  /** @internal References to the errors */
  @ContentChildren(DtError, { descendants: true })
  _errorChildren: QueryList<DtError>;

  /** @internal Reference to the control */
  @ContentChild(DtFormFieldControl)
  _control: DtFormFieldControl<T>;

  /** @internal References to the prefixes */
  @ContentChildren(DtPrefix, { descendants: true })
  _prefixChildren: QueryList<DtPrefix>;

  /** @internal References to the suffixes */
  @ContentChildren(DtSuffix, { descendants: true })
  _suffixChildren: QueryList<DtSuffix>;

  /** Subject used for unsubscribing */
  private _destroy$ = new Subject<void>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    public _elementRef: ElementRef,
  ) {}

  ngAfterContentInit(): void {
    this._validateControlChild();

    // Subscribe to changes in the child control state in order to update the form field UI.
    this._control.stateChanges
      .pipe(startWith(null), takeUntil(this._destroy$))
      .subscribe(() => {
        this._syncDescribedByIds();
        this._updateAnimationState();
        this._changeDetectorRef.markForCheck();
      });

    // Run change detection if the value, prefix, or suffix changes.
    const valueChanges =
      (this._control.ngControl && this._control.ngControl.valueChanges) ||
      EMPTY;
    merge(
      valueChanges,
      this._prefixChildren.changes,
      this._suffixChildren.changes,
    ).subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });

    // Re-validate when the number of hints changes.
    this._hintChildren.changes.pipe(startWith(null)).subscribe(() => {
      this._processHints();
      this._changeDetectorRef.markForCheck();
    });

    // Update the aria-described by when the number of errors changes.
    this._errorChildren.changes.pipe(startWith(null)).subscribe(() => {
      this._syncDescribedByIds();
      this._updateAnimationState();
      this._changeDetectorRef.markForCheck();
    });
  }

  ngAfterContentChecked(): void {
    this._validateControlChild();
  }

  ngAfterViewInit(): void {
    // Avoid animations on load.
    this._errorAnimationState = 'enter';
    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Gets an ElementRef for the element that a overlay attached to the form-field should be
   * positioned relative to.
   */
  getConnectedOverlayOrigin(): ElementRef {
    return this._elementRef;
  }

  /** @internal Determines whether a class from the NgControl should be forwarded to the host element. */
  _shouldForward(prop: string): boolean {
    const ngControl = this._control ? this._control.ngControl : null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-assertion
    return ngControl && (ngControl as any)[prop];
  }

  /** @internal Determines whether to display errors or not. */
  _getDisplayedError(): boolean {
    return (
      this._errorChildren &&
      this._errorChildren.length > 0 &&
      this._control.errorState
    );
  }

  /** Throws an error if the form field's control is missing. */
  private _validateControlChild(): void {
    if (!this._control) {
      throw getDtFormFieldMissingControlError();
    }
  }

  /** Does any extra processing that is required when handling the hints. */
  private _processHints(): void {
    this._validateHints();
    this._syncDescribedByIds();
    this._updateAnimationState();
  }

  /**
   * Ensure that there is a maximum of one of each `<dt-hint>` alignment specified, with the
   * attribute being considered as `align="start"`.
   */
  private _validateHints(): void {
    if (this._hintChildren) {
      let startHint: DtHint;
      let endHint: DtHint;
      this._hintChildren.forEach((hint: DtHint) => {
        if (hint.align === 'start') {
          if (startHint) {
            throw getDtFormFieldDuplicatedHintError('start');
          }
          startHint = hint;
        } else if (hint.align === 'end') {
          if (endHint) {
            throw getDtFormFieldDuplicatedHintError('end');
          }
          endHint = hint;
        }
      });
    }
  }

  /**
   * Sets the list of element IDs that describe the child control. This allows the control to update
   * its `aria-describedby` attribute accordingly.
   */
  private _syncDescribedByIds(): void {
    if (this._control) {
      let ids: string[] = [];

      if (!this._getDisplayedError()) {
        const startHint = this._hintChildren
          ? this._hintChildren.find((hint) => hint.align === 'start')
          : null;
        const endHint = this._hintChildren
          ? this._hintChildren.find((hint) => hint.align === 'end')
          : null;

        if (startHint) {
          ids.push(startHint.id);
        }

        if (endHint) {
          ids.push(endHint.id);
        }
      } else if (this._errorChildren) {
        ids = this._errorChildren.map((error) => error.id);
      }
      this._control.setDescribedByIds(ids);
    }
  }

  private _updateAnimationState(): void {
    this._errorAnimationState =
      this._getDisplayedError() && this._control.focused
        ? 'enter-delayed'
        : 'enter';
  }
}

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

import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  Optional,
  Inject,
  AfterContentInit,
  NgZone,
  ContentChildren,
} from '@angular/core';
import { BehaviorSubject, defer, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, take, takeUntil } from 'rxjs/operators';

import {
  DtUiTestConfiguration,
  DT_UI_TEST_CONFIG,
  dtSetUiTestAttribute,
} from '@dynatrace/barista-components/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

/** Type for the default event emitted whenever there is NO custom form passed tot the tag-add component */
export type DtTagAddSubmittedDefaultEvent = { tag: string };
/** Type for the event emitted whenever there is a custom form passed to the tag-add component */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DtTagAddSubmittedCustomFormEvent = Record<string, any>;

@Component({
  selector: 'dt-tag-add',
  exportAs: 'dtTagAdd',
  templateUrl: 'tag-add.html',
  styleUrls: ['tag-add.scss'],
  host: {
    class: 'dt-tag-add',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTagAdd implements OnDestroy, AfterContentInit {
  private readonly _destroy$ = new Subject<void>();

  /** @internal Status whether the Overlay is visible */
  _showOverlay = false;

  /** Placeholder for the input of the add-tag overlay input. */
  @Input() placeholder: string;

  /** Title of the button and the add-tag overlay input. */
  @Input() title = 'Add Tag';

  /** Used to set the 'aria-label' attribute on the underlying input element. */
  @Input('aria-label') ariaLabel: string;

  /**
   * Event emitted when form is submitted. Without a custom form passed as a child
   * the tags value will be returned in the event with the key 'tag'.
   */
  @Output() readonly submitted = new EventEmitter<
    DtTagAddSubmittedDefaultEvent | DtTagAddSubmittedCustomFormEvent
  >();

  /** @internal Custom form for adding tags. */
  @ContentChildren(FormGroupDirective, { descendants: true })
  _customFormQueryList: QueryList<FormGroupDirective>;

  /** @internal Overlay pane containing the fields. */
  @ViewChild(CdkConnectedOverlay, { static: true })
  _overlayDir: CdkConnectedOverlay;

  /**
   * @internal The focus trap for the selected area,
   * used by the selection area to chain the focus group of the area and the overlay.
   */
  @ViewChild(CdkTrapFocus, { static: true })
  _overlayFocusTrap: CdkTrapFocus;

  /**
   * @internal
   * This position config ensures that the top "start" corner of the overlay
   * is aligned with with the top "start" of the origin by default (overlapping
   * the trigger completely). If the panel cannot fit below the trigger, it
   * will fall back to a position above the trigger.
   */
  _positions = [
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'top',
      offsetX: 2,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetX: 2,
    },
  ];

  /** @internal the formGroup for the default form */
  _defaultFormControl = new FormGroup({
    tag: new FormControl('', [Validators.required]),
  });

  /** @internal Holds the current formGroup - either the default one or the custom form  */
  readonly _currentFormSubject$ = new BehaviorSubject<AbstractControl | null>(
    null,
  );

  /** @internal Emits whenever the current formGroup changes - can happen if a formGroup is passed in as a content child */
  readonly _currentFormGroupChanges$: Observable<AbstractControl> = defer(
    () => {
      if (this._customFormQueryList) {
        return this._customFormQueryList.changes.pipe(
          startWith(this._customFormQueryList.first),
          map(() => {
            return (
              this._customFormQueryList.first?.control ??
              this._defaultFormControl
            );
          }),
        );
      }
      return this._ngZone.onStable.asObservable().pipe(
        take(1),
        switchMap(() => this._currentFormGroupChanges$),
      );
    },
  );

  /** @internal Emits whether the current formGroup (default or custom) is valid */
  readonly _currentFormValid$ = this._currentFormGroupChanges$.pipe(
    switchMap((form) => form.statusChanges),
    map((status) => status === 'VALID'),
  );

  /** @internal Emits whether the component currently has a custom formGroup */
  readonly _hasCustomForm$: Observable<boolean> = defer(() => {
    if (this._customFormQueryList) {
      return this._customFormQueryList.changes.pipe(
        startWith(null),
        map(() => this._customFormQueryList.length > 0),
      );
    }

    return this._ngZone.onStable.asObservable().pipe(
      take(1),
      switchMap(() => this._hasCustomForm$),
    );
  });

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
    private _ngZone: NgZone,
    @Optional()
    @Inject(DT_UI_TEST_CONFIG)
    private _config?: DtUiTestConfiguration,
  ) {}

  ngAfterContentInit(): void {
    this._currentFormGroupChanges$
      .pipe(takeUntil(this._destroy$))
      .subscribe(this._currentFormSubject$);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal Callback that is invoked when the overlay panel has been attached. */
  _onAttached(): void {
    dtSetUiTestAttribute(
      this._overlayDir.overlayRef.overlayElement,
      this._overlayDir.overlayRef.overlayElement.id,
      this._elementRef,
      this._config,
    );
  }

  /** Opens the tag add Overlay by setting showOverlay to true. */
  open(): void {
    this._showOverlay = true;
    this._changeDetectorRef.markForCheck();
  }

  /** Closes the tag add Overlay by setting showOverlay to false. */
  close(): void {
    if (this._showOverlay) {
      this._showOverlay = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * Submits the current value of the form if it is valid,
   * by emitting the value default form or the custom form if one is provided.
   */
  submit(): void {
    const currentForm = this._currentFormSubject$.value;
    if (currentForm?.valid) {
      this.close();
      this.submitted.emit(currentForm.value);
      this._currentFormSubject$?.value?.reset();
    }
  }
}

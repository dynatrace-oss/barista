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
  ViewChildren,
  ViewEncapsulation,
  Optional,
  Inject,
  ContentChild,
  AfterContentInit,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { DtInput } from '@dynatrace/barista-components/input';
import {
  DtUiTestConfiguration,
  DT_UI_TEST_CONFIG,
  dtSetUiTestAttribute,
  isDefined,
  isEmpty,
} from '@dynatrace/barista-components/core';
import { DtTagAddForm } from './tag-add-form/tag-add-form';

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

  /** Event emitted when tag is added. Emits the value of first input field in the add tag overlay. */
  @Output() readonly tagAdded = new EventEmitter<string>();

  /** @internal Panel containing the select options. */
  @ViewChild('panel') _panel: ElementRef;

  /** @internal ElementRef of Add Tag Input */
  @ViewChildren(DtInput, { read: ElementRef }) _inputs: QueryList<
    ElementRef<HTMLInputElement>
  >;

  /** @internal */
  @ViewChild('tagAddButton', { static: true })
  _tagAddButton: ElementRef<HTMLElement>;

  /** @internal Custom form for adding tags. */
  @ContentChild(DtTagAddForm) _customAddForm: DtTagAddForm;

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

  private readonly _validSubject = new BehaviorSubject<boolean>(false);

  /** @internal Emits whether the current input/tag-add-form value is valid. */
  readonly _valid$: Observable<boolean> = this._validSubject.asObservable();

  private get _firstInput(): HTMLInputElement {
    const inputRef = this._customAddForm?._inputs.first ?? this._inputs.first;
    return inputRef.nativeElement;
  }

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional()
    @Inject(DT_UI_TEST_CONFIG)
    private _config?: DtUiTestConfiguration,
  ) {}

  ngAfterContentInit(): void {
    this._customAddForm?.valid$
      .pipe(takeUntil(this._destroy$))
      .subscribe(this._validSubject);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** @internal Callback that is invoked when the overlay panel has been attached. */
  _onAttached(): void {
    this._overlayDir.positionChange.pipe(take(1)).subscribe(() => {
      this._panel.nativeElement.scrollTop = 0;
    });
    setTimeout(() => {
      // Wait for first input to be rendered (either default input or first input in tag-add-form)
      // It's intentional that the close button is in the focus trap, but it shouldn't have initial focus
      // CDK's initial focus directive doesn't work for tag-add-form w/o warning logs
      this._firstInput.focus();
    });
    if (!isDefined(this._customAddForm)) {
      this._validSubject.next(false);
    }
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
   * Submits the current value of the input/form if it is valid,
   * by emitting the value of the first input field and closing the overlay.
   */
  submit(): void {
    if (this._validSubject.getValue()) {
      const tag = this._firstInput.value;
      this.tagAdded.emit(tag);
      this.close();
      this._customAddForm?._reset();
    }
  }

  /** @internal Updates the validity of the input/form based on the current value. */
  _onTagValueChange(): void {
    if (!isDefined(this._customAddForm)) {
      this._validSubject.next(!isEmpty(this._firstInput.value));
    }
  }
}

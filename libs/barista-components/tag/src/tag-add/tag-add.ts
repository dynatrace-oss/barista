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

import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  Optional,
  Inject,
} from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';

import { DtInput } from '@dynatrace/barista-components/input';
import {
  DtUiTestConfiguration,
  DT_UI_TEST_CONFIG,
  dtSetUiTestAttribute,
} from '@dynatrace/barista-components/core';

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
export class DtTagAdd implements AfterViewInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();

  /** @internal Status whether the Overlay is visible */
  _showOverlay = false;

  /** Placeholder for the input of the add-tag overlay input. */
  @Input() placeholder: string;

  /** Used to set the 'aria-label' attribute on the underlying input element. */
  @Input('aria-label') ariaLabel: string;

  /** Event emitted when tag is added */
  @Output() readonly tagAdded = new EventEmitter<string>();

  /** @internal Panel containing the select options. */
  @ViewChild('panel') _panel: ElementRef;

  /** @internal ElementRef of Add Tag Input */
  @ViewChildren(DtInput, { read: ElementRef }) _inputs: QueryList<
    ElementRef<HTMLInputElement>
  >;

  /** @internal */
  @ViewChild('tagAddButton', { static: true }) _tagAddButton: ElementRef<
    HTMLElement
  >;

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

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _zone: NgZone,
    @Optional()
    @Inject(DT_UI_TEST_CONFIG)
    private _config?: DtUiTestConfiguration,
    /** @breaking-change: `_elementRef` will be mandatory with version 7.0.0 */
    private _elementRef?: ElementRef<HTMLElement>,
  ) {}

  ngAfterViewInit(): void {
    this._inputs.changes
      .pipe(
        switchMap(() => this._zone.onMicrotaskEmpty.pipe(take(1))),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        const inputEl = this._inputs.first;
        if (inputEl) {
          inputEl.nativeElement.focus();
        }
      });
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

  /** @internal Checks whether user tag is empty or not and then calls 'addTag()' when not empty. */
  _addTagFromOverlayInput(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    if (target.value.length > 0) {
      this._addTag(target.value);
    }
  }

  /** @internal Emits the parameter which is the tag label, then closes the overlay. */
  _addTag(tag: string): void {
    this.tagAdded.emit(tag);
    this.close();
  }
}

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

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
  Input,
} from '@angular/core';
import { Subscription, timer } from 'rxjs';

import {
  _addCssClass,
  _removeCssClass,
} from '@dynatrace/barista-components/core';
import { DtInput } from '@dynatrace/barista-components/input';
import { ButtonVariant } from '@dynatrace/barista-components/button';

const DT_COPY_CLIPBOARD_TIMER = 800;
const DT_COPY_TO_CLIPBOARD_SUCCESSFUL = 'dt-copy-to-clipboard-successful';

@Component({
  selector: 'dt-copy-to-clipboard',
  templateUrl: 'copy-to-clipboard.html',
  styleUrls: ['copy-to-clipboard.scss'],
  exportAs: 'dtCopyToClipboard',
  host: {
    class: 'dt-copy-to-clipboard',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtCopyToClipboard implements AfterContentInit, OnDestroy {
  constructor(private _cd: ChangeDetectorRef) {}

  /** Defines the button variant of the copy button. */
  @Input() variant: ButtonVariant = 'primary';

  /** Emits a stream when the content has been copied. */
  @Output() readonly copied: EventEmitter<void> = new EventEmitter();

  /** Emits a stream when copying has failed. */
  @Output() readonly copyFailed: EventEmitter<void> = new EventEmitter();

  /** Emits a stream after the content has been copied. */
  @Output() readonly afterCopy: EventEmitter<void> = new EventEmitter();

  /** Whether the icon should be displayed. */
  get showIcon(): boolean {
    return this._showIcon;
  }
  private _showIcon = false;

  /** @internal Reference to the input element provided via ng-content. */
  @ContentChild(DtInput, { read: ElementRef })
  _input: ElementRef;

  /** @internal Reference to the dt-input directive provided via ng-content. */
  @ContentChild(DtInput) _inputComponent: DtInput;

  /** @internal Reference to the copy button element. */
  @ViewChild('copyButton', { read: ElementRef, static: true })
  _copyButton: ElementRef;

  private _timer: Subscription;

  /** Copies the provided content to the clipboard. */
  copyToClipboard(): void {
    if (this._input) {
      this._input.nativeElement.select();
      const copyResult = document.execCommand('copy');
      if (!copyResult) {
        this.copyFailed.emit();
        return;
      }
      this._showIcon = true;
      _addCssClass(this._input.nativeElement, DT_COPY_TO_CLIPBOARD_SUCCESSFUL);
      if (this._copyButton) {
        _addCssClass(
          this._copyButton.nativeElement,
          DT_COPY_TO_CLIPBOARD_SUCCESSFUL,
        );
        this._copyButton.nativeElement.focus();
      }
    }

    this._timer = timer(DT_COPY_CLIPBOARD_TIMER).subscribe((): void => {
      this._resetCopyState();

      this.afterCopy.emit();
    });
    this.copied.emit();
  }

  private _resetCopyState(): void {
    this._showIcon = false;
    _removeCssClass(this._input.nativeElement, DT_COPY_TO_CLIPBOARD_SUCCESSFUL);
    if (this._copyButton) {
      _removeCssClass(
        this._copyButton.nativeElement,
        DT_COPY_TO_CLIPBOARD_SUCCESSFUL,
      );
    }
    this._cd.markForCheck();
    this._timer.unsubscribe();
  }

  ngAfterContentInit(): void {
    if (this._inputComponent) {
      this._inputComponent.readonly = true;
    }
  }

  ngOnDestroy(): void {
    if (this._timer) {
      this._timer.unsubscribe();
    }
  }
}

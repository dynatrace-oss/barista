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
} from '@angular/core';
import { Subscription, timer } from 'rxjs';

import {
  addCssClass,
  removeCssClass,
} from '@dynatrace/angular-components/core';
import { DtInput } from '@dynatrace/angular-components/input';

const DT_COPY_CLIPBOARD_TIMER = 800;
const DT_COPY_TO_CLIPBOARD_SUCCESSFUL = 'dt-copy-to-clipboard-successful';

@Component({
  moduleId: module.id,
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
  @ContentChild(DtInput, { read: ElementRef, static: false })
  _input: ElementRef;

  /** @internal Reference to the dt-input directive provided via ng-content. */
  @ContentChild(DtInput, { static: false }) private inputComponent: DtInput;

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
      addCssClass(this._input.nativeElement, DT_COPY_TO_CLIPBOARD_SUCCESSFUL);
      if (this._copyButton) {
        addCssClass(
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
    removeCssClass(this._input.nativeElement, DT_COPY_TO_CLIPBOARD_SUCCESSFUL);
    if (this._copyButton) {
      removeCssClass(
        this._copyButton.nativeElement,
        DT_COPY_TO_CLIPBOARD_SUCCESSFUL,
      );
    }
    this._cd.markForCheck();
    this._timer.unsubscribe();
  }

  ngAfterContentInit(): void {
    if (this.inputComponent) {
      this.inputComponent.readonly = true;
    }
  }

  ngOnDestroy(): void {
    if (this._timer) {
      this._timer.unsubscribe();
    }
  }
}

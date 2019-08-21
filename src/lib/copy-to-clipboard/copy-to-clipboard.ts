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

  @Output() readonly copied: EventEmitter<void> = new EventEmitter();
  @Output() readonly copyFailed: EventEmitter<void> = new EventEmitter();
  @Output() readonly afterCopy: EventEmitter<void> = new EventEmitter();

  private _showIcon = false;
  get showIcon(): boolean {
    return this._showIcon;
  }

  private _timer: Subscription;
  @ContentChild(DtInput, { read: ElementRef, static: false })
  private input: ElementRef;
  @ContentChild(DtInput, { static: false }) private inputComponent: DtInput;
  @ViewChild('copyButton', { read: ElementRef, static: true })
  private copyButton: ElementRef;

  copyToClipboard(): void {
    if (this.input) {
      this.input.nativeElement.select();
      const copyResult = document.execCommand('copy');
      if (!copyResult) {
        this.copyFailed.emit();
        return;
      }
      this._showIcon = true;
      addCssClass(this.input.nativeElement, DT_COPY_TO_CLIPBOARD_SUCCESSFUL);
      if (this.copyButton) {
        addCssClass(
          this.copyButton.nativeElement,
          DT_COPY_TO_CLIPBOARD_SUCCESSFUL,
        );
        this.copyButton.nativeElement.focus();
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
    removeCssClass(this.input.nativeElement, DT_COPY_TO_CLIPBOARD_SUCCESSFUL);
    if (this.copyButton) {
      removeCssClass(
        this.copyButton.nativeElement,
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

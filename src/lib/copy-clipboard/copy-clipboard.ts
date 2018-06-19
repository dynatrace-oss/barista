import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import {DtInput} from '../input/input';
import {DtCopyClipboardSuccess} from './copy-clipboard-success';
import {DtCopyClipboardSource} from './copy-clipboard-source';
import {DtCopyClipboardLabel} from './copy-clipboard-label';
import {DtCopyClipboardButton} from './copy-clipboard-btn';

const DT_COPY_CLIPBOARD_TIMER = 800;

@Component({
  moduleId: module.id,
  selector: 'dt-copy-clipboard',
  templateUrl: 'copy-clipboard.html',
  styleUrls: ['copy-clipboard.scss'],
  exportAs: 'dtCopyClipboard',
  host: {
    class: 'dt-copy-clipboard',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtCopyClipboard implements AfterViewInit {

  private _enabled = true;
  // tslint:disable-next-line:no-any
  @Output() copied: EventEmitter<any> = new EventEmitter();
  @ContentChild(DtInput, {read: ElementRef}) input: ElementRef;
  @ContentChild(DtInput) inputComponent: DtInput;
  @ContentChild(DtCopyClipboardSource) source: DtCopyClipboardSource;
  @ContentChild(DtCopyClipboardSuccess) successText: DtCopyClipboardSuccess;
  @ContentChild(DtCopyClipboardButton) copyButton: DtCopyClipboardButton;
  @ContentChild(DtCopyClipboardLabel) copyLabel: DtCopyClipboardLabel;

  ngAfterViewInit(): void {
    if (this.copyButton) {
      this.copyButton.clicked.subscribe((event) => { this.copy2clipboard(); });
    }
    if (this.copyLabel) {
      this.copyLabel.clicked.subscribe((event) => { this.copy2clipboard(); });
    }
  }

  get enabled(): boolean {
    return this._enabled;
  }

  @Input() set enabled(value: boolean) {
    this._enabled = value;
    if (this.copyButton) {
      this.copyButton.enabled = value;
    }
    if (this.inputComponent) {
      this.inputComponent.disabled = !value;
    }
  }

  private copy2clipboard(): void {
    if (!this._enabled) {
      return; // do nothing if not enabled
    }
    if (this.input) {
      this.input.nativeElement.classList.add('dt-copy-clipboard-successful');
      setTimeout(
        () => {
          this.input.nativeElement.classList.remove('dt-copy-clipboard-successful');
          this.copied.emit();
        },
        DT_COPY_CLIPBOARD_TIMER);
      this.input.nativeElement.select();
      document.execCommand('copy');
    } /* then */ else if (this.source) {
      this.source.copy();
      if (this.successText) {
        this.copyLabel.hide();
        this.successText.show();
        setTimeout(() => { this.copyLabel.show(); this.successText.hide(); this.copied.emit(); }, DT_COPY_CLIPBOARD_TIMER);
      }
    } else {
      this.copied.emit();
    }
  }
}

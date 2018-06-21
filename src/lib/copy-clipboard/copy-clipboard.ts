import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ContentChildren, ChangeDetectorRef, AfterViewInit, QueryList, ViewChildren,
} from '@angular/core';
import {DtInput} from '../input/input';
import {addCssClass, removeCssClass} from '../core/util';
import {DtButton} from '../button';

const DT_COPY_CLIPBOARD_TIMER = 800000;

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
  constructor(private _cd: ChangeDetectorRef) { }

  @Output() copied: EventEmitter<string> = new EventEmitter();
  @ContentChild(DtInput, {read: ElementRef}) input: ElementRef;
  @ContentChild(DtInput) inputComponent: DtInput;
  @ViewChildren('copyButton') copyButton: QueryList<DtButton>;
  private _showIcon = false;

  private _enabled = true;
  @Input() set enabled(value: boolean) {
    this._enabled = value;
    if (this.copyButton && this.copyButton.length > 0) {
      this.copyButton.first.disabled = !value;
    }
    if (this.inputComponent) {
      this.inputComponent.disabled = !value;
    }
  }

  get enabled(): boolean {
    return this._enabled;
  }

  copy2Clipboard(): void {
    if (!this._enabled) {
      return; // do nothing if not enabled
    }
    if (this.input) {
      this._showIcon = true;
      addCssClass(this.input.nativeElement, 'dt-copy-clipboard-successful');
      setTimeout(
        () => {
          this._showIcon = false;
          removeCssClass(this.input.nativeElement, 'dt-copy-clipboard-successful');
        },
        DT_COPY_CLIPBOARD_TIMER);
      this.input.nativeElement.select();
      document.execCommand('copy');
      this.copied.emit(this.inputComponent.value);
    }
  }

  ngAfterViewInit(): void {
    if (this.copyButton && this.copyButton.length > 0) {
      this.copyButton.first.disabled = !this._enabled;
    }
    if (this.inputComponent) {
      this.inputComponent.disabled = !this._enabled;
    }
  }
}

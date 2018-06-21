import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  QueryList,
  ChangeDetectorRef,
  ViewChildren, ViewChild,
} from '@angular/core';
import {DtInput} from '../input/input';
import {addCssClass, removeCssClass} from '../core/util';
import {DtButton} from '../button';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';

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
export class DtCopyClipboard  {
  constructor(public _cd: ChangeDetectorRef) {

  }

  @Output() copied: EventEmitter<void> = new EventEmitter();
  @ContentChild(DtInput, {read: ElementRef}) input: ElementRef;
  @ContentChild(DtInput) inputComponent: DtInput;
  @ViewChildren('copyButton') copyButton: QueryList<DtButton>;
  @ViewChild('copyButton', {read: ElementRef}) copyButtonRef: ElementRef;
  // tslint:disable-next-line:no-unused-variable
  private _showIcon = false;
  get showIcon(): boolean {
    return this._showIcon;
  }

  private _enabled = true;
  @Input() set enabled(value: boolean) {
    this._enabled = value;
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
    this._showIcon = true;
    if (this.input) {
      addCssClass(this.input.nativeElement, 'dt-copy-clipboard-successful');
    }
    if (this.copyButtonRef) {
      addCssClass(this.copyButtonRef.nativeElement, 'dt-copy-clipboard-successful');
    }
    of(true).pipe(delay(DT_COPY_CLIPBOARD_TIMER)).subscribe((): void => {
      this._showIcon = false;
      if (this.input) {
        removeCssClass(this.input.nativeElement, 'dt-copy-clipboard-successful');
      }
      if (this.copyButtonRef) {
        removeCssClass(this.copyButtonRef.nativeElement, 'dt-copy-clipboard-successful');
      }
      this._cd.markForCheck();
    });
    if (this.input) {
      this.input.nativeElement.select();
      document.execCommand('copy');
    }
    /* then */
    this.copied.emit();
  }
}

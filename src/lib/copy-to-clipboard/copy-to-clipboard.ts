import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ChangeDetectorRef,
  ViewChild, AfterContentInit,
} from '@angular/core';
import {DtInput} from '../input/input';
import {addCssClass, removeCssClass} from '../core/util';
import {timer, Subscription} from 'rxjs';

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
export class DtCopyToClipboard implements AfterContentInit {
  constructor(public _cd: ChangeDetectorRef) {
  }

  private _timer: Subscription;
  @Output() copied: EventEmitter<void> = new EventEmitter();
  @Output() copyFailed: EventEmitter<void> = new EventEmitter();
  @ContentChild(DtInput, {read: ElementRef}) input: ElementRef;
  @ContentChild(DtInput) inputComponent: DtInput;
  @ViewChild('copyButton', {read: ElementRef}) copyButtonRef: ElementRef;
  // tslint:disable-next-line:no-unused-variable
  private _showIcon = false;
  get showIcon(): boolean {
    return this._showIcon;
  }

  private _disabled = false;
  get disabled(): boolean {
    return this._disabled;
  }

  @Input() set disabled(value: boolean) {
    this._disabled = value;
    if (this.inputComponent) {
      this.inputComponent.disabled = value;
    }
  }

  copyToClipboard(): void {
    if (this._disabled) {
      return;
    } /* then */
    if (this.input) {
      this.input.nativeElement.select();
      if (!document.execCommand('copy')) {
        this.copyFailed.emit();
        return;
      }
    } /* then */
    this._showIcon = true;

    if (this.input) {
      addCssClass(this.input.nativeElement, DT_COPY_TO_CLIPBOARD_SUCCESSFUL);
    } /* then */
    if (this.copyButtonRef) {
      addCssClass(this.copyButtonRef.nativeElement, DT_COPY_TO_CLIPBOARD_SUCCESSFUL);
    } /* then */

    this._timer = timer(DT_COPY_CLIPBOARD_TIMER).subscribe((): void => {
      this._resetCopyState();
    });

    this.copied.emit();
  }

  private _resetCopyState(): void {
    this._showIcon = false;
    if (this.input) {
      removeCssClass(this.input.nativeElement, DT_COPY_TO_CLIPBOARD_SUCCESSFUL);
    }
    /* then */
    if (this.copyButtonRef) {
      removeCssClass(this.copyButtonRef.nativeElement, DT_COPY_TO_CLIPBOARD_SUCCESSFUL);
    }
    /* then */
    this._cd.markForCheck();
    this._timer.unsubscribe();
  }

  ngAfterContentInit(): void {
    if (this.inputComponent) {
      this.inputComponent.readonly = true;
    }
  }
}

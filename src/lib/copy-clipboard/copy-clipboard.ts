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
  ViewChild,
  ViewChildren,
  ChangeDetectorRef, QueryList,
} from '@angular/core';
import {DtInput} from '../input/input';
import {DtButton} from '../button/button';

const DT_COPY_CLIPBOARD_TIMER = 800;

@Component({
  moduleId: module.id,
  selector: 'dt-copy-clipboard-success',
  exportAs: 'dtCopyClipboardSuccess',
  styleUrls: ['copy-clipboard-source.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  template: `<ng-content *ngIf="_show"></ng-content>`,
  host: {
    class: 'dt-copy-clipboard-success',
  },
})
export class DtCopyClipboardSuccess {
  private _show = false;

  constructor(private cd: ChangeDetectorRef) { }
  show(): void {
    this._show = true;
    this.cd.detectChanges();
  }
  hide(): void {
    this._show = false;
    this.cd.detectChanges();
  }
}

/** source of copy 2 clipboard, needed as it's used as a selector in the API. */
@Component({
  moduleId: module.id,
  selector: 'dt-copy-clipboard-source',
  exportAs: 'dtCopyClipboardSource',
  styleUrls: ['copy-clipboard-source.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  template: `<textarea class="dt-copy-clipboard-source-hiddentext" #dtcopyclipboardsourcehiddentext></textarea>
  <span #dtcopyclipboardsourcetext><ng-content></ng-content></span>`,
  host: {
    class: 'dt-copy-clipboard-source',
  },
})
export class DtCopyClipboardSource {
  @ViewChild('dtcopyclipboardsourcehiddentext', {read: ElementRef}) private hiddenTextarea: ElementRef;
  @ViewChild('dtcopyclipboardsourcetext', {read: ElementRef}) private text2Copy: ElementRef;

  copy(): void {
    this.hiddenTextarea.nativeElement.value = null;
    const copyText = this.text2Copy.nativeElement.innerText;
    this.hiddenTextarea.nativeElement.value = copyText;
    this.hiddenTextarea.nativeElement.focus();
    this.hiddenTextarea.nativeElement.select();
    document.execCommand('copy');
  }
}

/** Display label of the copy 2 clipboard */
@Component({
  moduleId: module.id,
  selector: 'dt-copy-clipboard-label',
  exportAs: 'dtCopyClipboardLabel',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  template: `<span *ngIf="_show" (click)="clicked()"><ng-content></ng-content></span>`,
  host: {
    class: 'dt-copy-clipboard-label',
  },
})
export class DtCopyClipboardLabel {
  @Input() click: EventEmitter<any> = new EventEmitter();
  @ContentChild('copyclipboardlabelwrap') private _copyclipboardlabelwrap : ElementRef;
  private _show = true;

  constructor(private cd: ChangeDetectorRef) { }
  private clicked(): void {
    this.click.emit();
  }

  hide(): void {
    this._show = false;
    this.cd.detectChanges();
  }

  show(): void {
    this._show = true;
    this.cd.detectChanges();
  }
}

/** button of the copy 2 clipboard element. */
@Component({
  moduleId: module.id,
  exportAs: 'dtCopyClipboardBtn',
  selector: 'dt-copy-clipboard-btn',
  styleUrls: ['copy-clipboard-btn.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: 'copy-clipboard-btn.html',
  host: {
    class: 'dt-copy-clipboard-button',
  },
})
export class DtCopyClipboardButton implements AfterViewInit {
  @ViewChildren('clickBtn')  private _btns: QueryList<DtButton>;
  private _showCheck = false;
  private _enabled = true;
  @Output() click: EventEmitter<any> = new EventEmitter();

  constructor(private cd: ChangeDetectorRef) { }

  private clicktrigger(): void {
    this._showCheck = true;
    setTimeout(() => {
      this._showCheck = false;
      this.cd.detectChanges();
    }, DT_COPY_CLIPBOARD_TIMER);
    this.click.emit();
  }

  @Input() set enabled(_enable: boolean) {
    this._enabled = _enable;
    if (this._btns && this._btns.length > 0) {
      this._btns.first.disabled = !_enable;
    }
    /* then */
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    if (this._btns && this._btns.length > 0) {
      this._btns.first.disabled = !this._enabled;
    }
    this.cd.detectChanges();
  }
}

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
  encapsulation: ViewEncapsulation.None,
})
export class DtCopyClipboard implements AfterViewInit {

  private _enabled = true;
  @Output() copied: EventEmitter<any> = new EventEmitter();
  @ContentChild(DtInput, {read: ElementRef}) input: ElementRef;
  @ContentChild(DtInput) inputComponent: DtInput;
  @ContentChild(DtCopyClipboardSource) source: DtCopyClipboardSource;
  @ContentChild(DtCopyClipboardSuccess) successText: DtCopyClipboardSuccess;
  @ContentChild(DtCopyClipboardButton) copyButton: DtCopyClipboardButton;
  @ContentChild(DtCopyClipboardLabel) copyLabel: DtCopyClipboardLabel;

  ngAfterViewInit(): void {
    if (this.copyButton) {
      this.copyButton.click.subscribe((event) => this.copy2clipboard());
    }
    if (this.copyLabel) {
      this.copyLabel.click.subscribe((event) => this.copy2clipboard());
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
    if (this.input) {
      this.input.nativeElement.classList.add('dt-copy-clipboard-successful');
      setTimeout(() => {
        this.input.nativeElement.classList.remove('dt-copy-clipboard-successful');
      }, DT_COPY_CLIPBOARD_TIMER);
      this.input.nativeElement.select();
      document.execCommand('copy');
      this.copied.emit();
    } /* then */ else if (this.source) {
      this.source.copy();
      if (this.successText) {
        this.copyLabel.hide();
        this.successText.show();
        setTimeout(() => {
          this.copyLabel.show();
          this.successText.hide();
        }, DT_COPY_CLIPBOARD_TIMER);
      }
      this.copied.emit();
    }
  }
}

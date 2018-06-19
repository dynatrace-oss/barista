import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef, Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {DtButton} from '../button/button';

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
  @ViewChildren('clickBtn') private _btns: QueryList<DtButton>;
  // tslint:disable-next-line:no-unused-variable
  private _showCheck = false;
  private _enabled = true;
  // tslint:disable-next-line:no-any
  @Output() clicked: EventEmitter<any> = new EventEmitter();

  constructor(private cd: ChangeDetectorRef) {
  }

  // tslint:disable-next-line:no-unused-variable
  private clicktrigger(): void {
    const dtCopyClipboardTimeout = 800;
    this._showCheck = true;
    setTimeout(() => { this._showCheck = false; this.cd.detectChanges(); }, dtCopyClipboardTimeout);
    this.clicked.emit();
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

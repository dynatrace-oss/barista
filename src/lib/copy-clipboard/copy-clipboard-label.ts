import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  ViewEncapsulation
} from '@angular/core';

/** Display label of the copy 2 clipboard */
@Component({
  moduleId: module.id,
  selector: 'dt-copy-clipboard-label',
  exportAs: 'dtCopyClipboardLabel',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  template: `<span *ngIf="_show" (click)="clickTrigger()"><ng-content></ng-content></span>`,
  host: {
    class: 'dt-copy-clipboard-label',
  },
})
export class DtCopyClipboardLabel {
  // tslint:disable-next-line:no-any
  @Input() clicked: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-unused-variable
  _show = true;

  constructor(private cd: ChangeDetectorRef) { }
  // tslint:disable-next-line:no-unused-variable
  clickTrigger(): void {
    this.clicked.emit();
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

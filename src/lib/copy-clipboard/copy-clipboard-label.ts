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
  template: `<span (click)="clickTrigger()">
    <dt-icon name="checkmark" *ngIf="!show" ></dt-icon>
    <ng-content *ngIf="show"></ng-content>
  </span>`,
  host: {
    class: 'dt-copy-clipboard-label',
  },
})
export class DtCopyClipboardLabel {
  // tslint:disable-next-line:no-any
  @Input() clicked: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-unused-variable
  private _show = true;

  constructor(private cd: ChangeDetectorRef) { }
  // tslint:disable-next-line:no-unused-variable
  clickTrigger(): void {
    this.clicked.emit();
  }

  set show(show: boolean) {
    this._show = show;
    this.cd.markForCheck();
  }

  get show(): boolean {
    this._show = true;
    this.cd.markForCheck();
    return this._show;
  }
}

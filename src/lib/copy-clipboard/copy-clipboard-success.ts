import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-copy-clipboard-success',
  exportAs: 'dtCopyClipboardSuccess',
  styleUrls: ['copy-clipboard-source.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <ng-content *ngIf="_show"></ng-content>`,
  host: {
    class: 'dt-copy-clipboard-success',
  },
})
export class DtCopyClipboardSuccess {
  _show = false;

  constructor(private cd: ChangeDetectorRef) {
  }

  show(): void {
    this._show = true;
    this.cd.detectChanges();
  }

  get visible(): boolean {
    return this._show;
  }

  hide(): void {
    this._show = false;
    this.cd.detectChanges();
  }
}

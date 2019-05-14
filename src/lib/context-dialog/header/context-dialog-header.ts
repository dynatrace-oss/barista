import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-context-dialog-header',
  templateUrl: 'context-dialog-header.html',
  styleUrls: ['context-dialog-header.scss'],
  host: {
    class: 'dt-context-dialog-header',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtContextDialogHeader { }

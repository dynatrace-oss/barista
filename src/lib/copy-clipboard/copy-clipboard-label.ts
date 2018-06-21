import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation
} from '@angular/core';

/* Display label of the copy 2 clipboard, will be disabled inside a button */
@Component({
  moduleId: module.id,
  selector: 'dt-copy-clipboard-label',
  exportAs: 'dtCopyClipboardLabel',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'dt-copy-clipboard-label',
  },
})
export class DtCopyClipboardLabel {
}

import {ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';

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

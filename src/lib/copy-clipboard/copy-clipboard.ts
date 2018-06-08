import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Directive,
  ContentChild,
  AfterContentInit, 
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef
} from '@angular/core'; 

/** Title of a card, needed as it's used as a selector in the API. */
@Component({
    moduleId: module.id,
    selector: 'dtCopyCb',
    exportAs: 'dtCopyCb',
    template: '<span (click)="clicked(event)"><ng-content></ng-content></span>',
    styleUrls: ['copy-clipboard.scss'],
    host: {
        'class': 'dt-copy-clipboard-span'
    },
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
export class DtCopyClipboardSpan {
    @Input() afterCopyText : string;
    @Input() copyTimer = 800;
    @Input() copytext : string;
    clicked(event) {
        alert(this.copytext);
    }
}

/** Title of a card, needed as it's used as a selector in the API. */
@Component({
    moduleId: module.id,
    selector: 'dt-copy-clipboard-btn',
    exportAs: 'dtCopyClipboardBtn',
    template: '<ng-content></ng-content>',
    styleUrls: ['copy-clipboard.scss'],
    host: {
        'class': 'dt-copy-clipboard-button'
    },
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
export class DtCopyClipboardButton {
    
}

@Component({
  moduleId: module.id,
  selector: 'dt-copy-clipboard',
  exportAs: 'dtCopyClipboard',
  templateUrl: 'copy-clipboard.html',
  styleUrls: ['copy-clipboard.scss'],
  host: {
    'class': 'dt-copy-clipboard'
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtCopyClipboard implements AfterContentInit{
    ngAfterContentInit(): void {
        // search for input
    }
    @Output() onCopied: EventEmitter<string> = new EventEmitter();
    
    @ContentChild("textarea") input;
    copy2clipboard() {
        var value = "copy";
        this.onCopied.emit(value);
        document.execCommand("copy");
    }
}

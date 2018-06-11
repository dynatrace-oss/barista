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
  ElementRef,
  ViewChild
} from '@angular/core'; 
import {DtInput} from '../input/input';

/** source of copy 2 clipboard, needed as it's used as a selector in the API. */
@Component({
    moduleId: module.id,
    selector: 'dt-copy-clipboard-source',
    exportAs: 'dt-copy-clipboard-source',
    template: '<textarea class="dt-copy-clipboard-source-hiddentext" #dtcopyclipboardsourcehiddentext></textarea><span #dtcopyclipboardsourcetext><ng-content></ng-content></span>',
    styleUrls: ['copy-clipboard.scss'],
    host: {
        'class': 'dt-copy-clipboard-source'
    },
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
export class DtCopyClipboardSource {
    @ViewChild('dtcopyclipboardsourcehiddentext', { read: ElementRef }) hiddenTextarea : ElementRef;
    @ViewChild('dtcopyclipboardsourcetext', { read: ElementRef }) text2Copy : ElementRef;
    
    public copy() : void {
        this.hiddenTextarea.nativeElement.value = null;
        let copyText = this.text2Copy.nativeElement.innerText;
        this.hiddenTextarea.nativeElement.value = copyText;
        this.hiddenTextarea.nativeElement.focus();
        this.hiddenTextarea.nativeElement.select();
        document.execCommand("copy");
    }
    
}

/** Title of a card, needed as it's used as a selector in the API. */
@Component({
    moduleId: module.id,
    selector: 'dt-copy-clipboard-label',
    exportAs: 'dt-copy-clipboard-label',
    template: '<span (click)="clicked(event)"><ng-content></ng-content></span>',
    styleUrls: ['copy-clipboard.scss'],
    host: {
        'class': 'dt-copy-clipboard-label'
    },
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
export class DtCopyClipboardLabel {
    @Input() click : EventEmitter<any> = new EventEmitter();
    clicked(event) {

        this.click.emit();
    }
}

/** Title of a card, needed as it's used as a selector in the API. */
@Component({
    moduleId: module.id,
    selector: 'dt-copy-clipboard-btn',
    exportAs: 'dt-copy-clipboard-btn',
    template: '<button  dt-button (click)="clicktrigger()"><ng-content></ng-content></button>',
    styleUrls: ['copy-clipboard.scss'],
    host: {
        'class': 'dt-copy-clipboard-button'
    },
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
export class DtCopyClipboardButton {
    @Output() click : EventEmitter<any> = new EventEmitter();
    clicktrigger() {
        this.click.emit();
    }
}

@Component({
  moduleId: module.id,
  selector: 'dt-copy-clipboard',
  exportAs: 'dt-copy-clipboard',
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
        if (this.copyButton!=null) {
            this.copyButton.click.subscribe(event => this.copy2clipboard());
        } 
        if (this.copyLabel!=null) {
            this.copyLabel.click.subscribe(event => this.copy2clipboard());
        } 
    }
    
    @Output() copied: EventEmitter<any> = new EventEmitter();
    @ContentChild(DtInput, { read: ElementRef }) input : ElementRef;
    @ContentChild(DtCopyClipboardSource) source : DtCopyClipboardSource;

    
    @ContentChild(DtCopyClipboardButton) copyButton : DtCopyClipboardButton;
    @ContentChild(DtCopyClipboardLabel) copyLabel : DtCopyClipboardLabel;
    private copy2clipboard() : void {
        if (this.input!=null) {
            this.input.nativeElement.select();
            document.execCommand("copy");
            this.copied.emit();
        } /* then */
        else if (this.source!=null) {
            this.source.copy();
            this.copied.emit();
        }
    }
}

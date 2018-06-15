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
import { DtInput } from '../input/input';
import { DtButton } from '../button/button';
import { DtIcon } from '../icon/icon';

const DT_COPY_CLIPBOARD_TIMER = 800000;

/** source of copy 2 clipboard, needed as it's used as a selector in the API. */
@Component( {
    moduleId: module.id,
    selector: 'dt-copy-clipboard-source',
    styleUrls: ['copy-clipboard-source.scss'],
    template: `<textarea class="dt-copy-clipboard-source-hiddentext" #dtcopyclipboardsourcehiddentext></textarea>
        <span #dtcopyclipboardsourcetext><ng-content></ng-content></span>`,
    host: {
        'class': 'dt-copy-clipboard-source'
    },
} )
export class DtCopyClipboardSource {
    @ViewChild( 'dtcopyclipboardsourcehiddentext', { read: ElementRef } ) hiddenTextarea: ElementRef;
    @ViewChild( 'dtcopyclipboardsourcetext', { read: ElementRef } ) text2Copy: ElementRef;

    public copy(): void {
        this.hiddenTextarea.nativeElement.value = null;
        let copyText = this.text2Copy.nativeElement.innerText;
        this.hiddenTextarea.nativeElement.value = copyText;
        this.hiddenTextarea.nativeElement.focus();
        this.hiddenTextarea.nativeElement.select();
        document.execCommand( "copy" );
    }

}

/** Display label of the copy 2 clipboard */
@Component( {
    moduleId: module.id,
    selector: 'dt-copy-clipboard-label',
    template: `<span (click)="clicked(event)"><ng-content></ng-content></span>`,
    host: {
        'class': 'dt-copy-clipboard-label'
    },
} )
export class DtCopyClipboardLabel {
    @Input() click: EventEmitter<any> = new EventEmitter();
    clicked( event ) {
        this.click.emit();
    }
}

/** button of the copy 2 clipboard element. */
@Component( {
    moduleId: module.id,
    selector: 'dt-copy-clipboard-btn',
    styleUrls: ['copy-clipboard-btn.scss'],
    template: `
<button dt-button class="dt-copy-clipboard-success" *ngIf="_showCheck" >
  <dt-icon name="checkmark"></dt-icon>
</button>
<button dt-button (click)="clicktrigger()" *ngIf="!_showCheck" #clickBtn>
  <ng-content></ng-content>
</button>`,
    host: {
        'class': 'dt-copy-clipboard-button'
    },
} )
export class DtCopyClipboardButton {

    @ViewChild( 'clickBtn' ) _btn: DtButton;
    private _showCheck : boolean = false;
    @Output() click: EventEmitter<any> = new EventEmitter();
    clicktrigger() {
        this._showCheck = true;
        setTimeout(() => {
            this._showCheck = false;
        }, DT_COPY_CLIPBOARD_TIMER); 
        this.click.emit();
    }
    @Input() set enabled (_enable : boolean) {
        if (this._btn!=null) {
            this._btn.disabled = !_enable;
        } /* then */
    }
}

@Component( {
    moduleId: module.id,
    selector: 'dt-copy-clipboard',
    templateUrl: 'copy-clipboard.html',
    styleUrls: ['copy-clipboard.scss'],
    host: {
        'class': 'dt-copy-clipboard'
    },
    encapsulation: ViewEncapsulation.None,
} )
export class DtCopyClipboard implements AfterContentInit {
    ngAfterContentInit(): void {
        if ( this.copyButton != null ) {
            this.copyButton.click.subscribe( event => this.copy2clipboard() );
        }
        if ( this.copyLabel != null ) {
            this.copyLabel.click.subscribe( event => this.copy2clipboard() );
        }
    }

    private _enabled: boolean = true;
    get enabled (): boolean {
        return this._enabled;
    }
    
    @Input() set enabled (value : boolean) {
        this._enabled = value;
        if (this.copyButton!=null) {
            this.copyButton.enabled = value;
        }
        if (this.inputComponent!=null) {
            this.inputComponent.disabled = !value;
        }
    }
    @Output() copied: EventEmitter<any> = new EventEmitter();
    @ContentChild( DtInput, { read: ElementRef } ) input: ElementRef;
    @ContentChild( DtInput ) inputComponent: DtInput;
    @ContentChild( DtCopyClipboardSource ) source: DtCopyClipboardSource;


    @ContentChild( DtCopyClipboardButton ) copyButton: DtCopyClipboardButton;
    @ContentChild( DtCopyClipboardLabel ) copyLabel: DtCopyClipboardLabel;
    private copy2clipboard(): void {
        if ( this.input != null ) {
            let self = this;
            this.input.nativeElement.classList.add("dt-copy-clipboard-success");
            setTimeout(function() {
                self.input.nativeElement.classList.remove("dt-copy-clipboard-success");
            }, DT_COPY_CLIPBOARD_TIMER);
            this.input.nativeElement.select();
            document.execCommand( "copy" );
            this.copied.emit();
        } /* then */
        else if ( this.source != null ) {
            this.source.copy();
            this.copied.emit();
        }
    }
}

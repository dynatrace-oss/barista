export declare class DtCopyToClipboard implements AfterContentInit, OnDestroy {
    _copyButton: ElementRef;
    _input: ElementRef;
    _inputComponent: DtInput;
    readonly afterCopy: EventEmitter<void>;
    readonly copied: EventEmitter<void>;
    readonly copyFailed: EventEmitter<void>;
    get showIcon(): boolean;
    variant: ButtonVariant;
    constructor(_changeDetectorRef: ChangeDetectorRef, _cdkClipboard: Clipboard);
    _copiedToClipboard(): void;
    copyToClipboard(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare class DtCopyToClipboardLabel {
}

export declare class DtCopyToClipboardModule {
}

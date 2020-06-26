export declare const _DtContextDialogMixinBase: import("../../core/dynatrace-barista-components-core").Constructor<HasTabIndex> & import("../../core/dynatrace-barista-components-core").Constructor<CanDisable> & typeof DtContextDialogBase;

export declare const DT_CONTEXT_DIALOG_CONFIG: InjectionToken<OverlayConfig>;

export declare class DtContextDialog extends _DtContextDialogMixinBase implements CanDisable, HasTabIndex, OnDestroy, AfterViewInit {
    _ariaLabelClose: string;
    _defaultTrigger: CdkOverlayOrigin;
    _overlayTemplate: TemplateRef<void>;
    _panel: ElementRef;
    ariaLabel: string;
    get ariaLabelClose(): string;
    set ariaLabelClose(value: string);
    ariaLabelledBy: string;
    get hasCustomTrigger(): boolean;
    get isPanelOpen(): boolean;
    readonly openedChange: EventEmitter<boolean>;
    overlayPanelClass: string | string[] | Set<string> | {
        [key: string]: any;
    };
    get trigger(): CdkOverlayOrigin | DtContextDialogTrigger;
    constructor(_overlay: Overlay, _viewContainerRef: ViewContainerRef, _changeDetectorRef: ChangeDetectorRef, _focusTrapFactory: FocusTrapFactory, _elementRef: ElementRef<HTMLElement>, tabIndex: string, _document: any, _config?: DtUiTestConfiguration | undefined, _userConfig?: OverlayConfig | undefined);
    _registerTrigger(trigger: DtContextDialogTrigger): void;
    _unregisterTrigger(trigger: DtContextDialogTrigger): void;
    close(): void;
    focus(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    open(): void;
}

export declare class DtContextDialogBase {
}

export declare class DtContextDialogHeader {
}

export declare class DtContextDialogHeaderTitle {
}

export declare class DtContextDialogModule {
}

export declare class DtContextDialogTrigger extends CdkOverlayOrigin implements OnDestroy {
    get dialog(): DtContextDialog | undefined;
    set dialog(value: DtContextDialog | undefined);
    readonly openChange: EventEmitter<void>;
    constructor(elementRef: ElementRef);
    _unregisterFromDialog(): void;
    ngOnDestroy(): void;
}

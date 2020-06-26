export declare class DtShowMore extends _DtShowMoreMixinBase implements CanDisable, OnDestroy {
    get _ariaLabel(): string | null;
    get ariaLabelShowLess(): string;
    set ariaLabelShowLess(value: string);
    readonly changed: EventEmitter<void>;
    get showLess(): boolean;
    set showLess(value: boolean);
    constructor(_elementRef: ElementRef, _focusMonitor: FocusMonitor);
    _handleClick(): void;
    ngOnDestroy(): void;
}

export declare class DtShowMoreBase {
}

export declare class DtShowMoreModule {
}

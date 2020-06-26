export declare const _DtButtonMixinBase: Constructor<CanDisable> & Constructor<CanColor<DtButtonThemePalette>> & Constructor<DtButtonBase>;

export declare type ButtonVariant = 'primary' | 'secondary' | 'nested';

export declare class DtAnchor extends DtButton {
    constructor(elementRef: ElementRef, focusMonitor: FocusMonitor, changeDetectorRef: ChangeDetectorRef);
    _haltDisabledEvents(event: Event): void;
}

export declare class DtButton extends _DtButtonMixinBase implements OnDestroy, AfterContentInit, CanDisable, CanColor<DtButtonThemePalette>, HasElementRef {
    _icons: QueryList<DtIcon>;
    _isIconButton: boolean;
    get variant(): ButtonVariant;
    set variant(value: ButtonVariant);
    constructor(elementRef: ElementRef, _focusMonitor: FocusMonitor, _changeDetectorRef: ChangeDetectorRef);
    focus(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare class DtButtonBase {
    _elementRef: ElementRef;
    constructor(_elementRef: ElementRef);
}

export declare class DtButtonModule {
}

export declare type DtButtonThemePalette = 'main' | 'warning' | 'cta';

export declare const _DtIndicatorMixinBase: Constructor<CanColor<DtIndicatorThemePalette>> & Constructor<DtIndicatorBase>;

export declare class DtIndicator extends _DtIndicatorMixinBase implements CanColor<DtIndicatorThemePalette>, OnDestroy, OnChanges {
    _stateChanges: Subject<void>;
    get active(): boolean;
    set active(value: boolean);
    constructor(elementRef: ElementRef);
    ngOnChanges(): void;
    ngOnDestroy(): void;
}

export declare class DtIndicatorBase {
    _elementRef: ElementRef;
    constructor(_elementRef: ElementRef);
}

export declare class DtIndicatorModule {
}

export declare type DtIndicatorThemePalette = 'error' | 'warning' | undefined;

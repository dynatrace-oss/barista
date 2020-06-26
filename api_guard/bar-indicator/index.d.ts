export declare const _DtBarIndicator: Constructor<HasProgressValues> & Constructor<CanColor<DtBarIndicatorThemePalette>> & Constructor<DtBarIndicatorBase>;

export declare class DtBarIndicator extends _DtBarIndicator implements CanColor<DtBarIndicatorThemePalette>, HasProgressValues {
    align: 'start' | 'end';
    constructor(_changeDetectorRef: ChangeDetectorRef, elementRef: ElementRef);
    _updateValues(): void;
}

export declare class DtBarIndicatorBase {
    _elementRef: ElementRef;
    constructor(_elementRef: ElementRef);
}

export declare class DtBarIndicatorModule {
}

export declare type DtBarIndicatorThemePalette = 'main' | 'recovered' | 'error';

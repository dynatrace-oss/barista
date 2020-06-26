export declare const _DtProgressCircle: Constructor<HasProgressValues> & Constructor<CanColor<DtProgressCircleThemePalette>> & Constructor<DtProgressCircleBase>;

export declare class DtProgressCircle extends _DtProgressCircle implements CanColor<DtProgressCircleThemePalette>, HasProgressValues {
    _dashOffset: number;
    _elementRef: ElementRef;
    constructor(_changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef);
    _updateValues(): void;
}

export declare class DtProgressCircleBase {
    _elementRef: ElementRef;
    constructor(_elementRef: ElementRef);
}

export declare type DtProgressCircleChange = DtProgressChange;

export declare class DtProgressCircleModule {
}

export declare type DtProgressCircleThemePalette = 'main' | 'accent' | 'warning' | 'recovered' | 'error';

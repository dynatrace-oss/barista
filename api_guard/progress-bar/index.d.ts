export declare const _DtProgressBar: Constructor<HasProgressValues> & Constructor<CanColor<DtProgressBarThemePalette>> & Constructor<DtProgressBarBase>;

export declare class DtProgressBar extends _DtProgressBar implements CanColor<DtProgressBarThemePalette>, HasProgressValues {
    _count: DtProgressBarCount;
    _description: DtProgressBarDescription;
    get _hasDescriptionOrCount(): boolean;
    align: 'start' | 'end';
    constructor(_changeDetectorRef: ChangeDetectorRef, elementRef: ElementRef);
    _updateValues(): void;
}

export declare class DtProgressBarBase {
    _elementRef: ElementRef;
    constructor(_elementRef: ElementRef);
}

export declare type DtProgressBarChange = DtProgressChange;

export declare class DtProgressBarCount {
}

export declare class DtProgressBarDescription {
}

export declare class DtProgressBarModule {
}

export declare type DtProgressBarThemePalette = 'main' | 'accent' | 'warning' | 'recovered' | 'error';

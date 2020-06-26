export declare const _DtTileMixinBase: Constructor<HasTabIndex> & Constructor<CanDisable> & Constructor<CanColor<DtTileThemePalette>> & Constructor<DtTileBase>;

export declare class DtTile extends _DtTileMixinBase implements CanDisable, HasElementRef, CanColor<DtTileThemePalette>, HasTabIndex, OnDestroy {
    _icon: DtTileIcon;
    _subTitle: DtTileSubtitle;
    constructor(elementRef: ElementRef, _focusMonitor: FocusMonitor);
    _haltDisabledEvents(event: Event): void;
    ngOnDestroy(): void;
}

export declare class DtTileBase {
    _elementRef: ElementRef;
    constructor(_elementRef: ElementRef);
}

export declare class DtTileIcon {
}

export declare class DtTileModule {
}

export declare class DtTileSubtitle {
}

export declare type DtTileThemePalette = 'main' | 'error' | 'recovered';

export declare class DtTileTitle {
}

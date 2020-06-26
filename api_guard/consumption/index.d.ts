export declare class DtConsumption extends _DtConsumption implements AfterViewInit, OnDestroy {
    readonly _elementRef: ElementRef<HTMLElement>;
    _tabIndex: number;
    get max(): number;
    set max(val: number);
    get value(): number;
    set value(val: number);
    constructor(_elementRef: ElementRef<HTMLElement>, _overlay: Overlay, _viewContainerRef: ViewContainerRef, _changeDetectorRef: ChangeDetectorRef, _focusMonitor: FocusMonitor, _config?: DtUiTestConfiguration | undefined);
    _createOverlay(): void;
    _destroyOverlay(): void;
    _toggleOverlay(keyEvent: KeyboardEvent): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}

export declare class DtConsumptionCount {
}

export declare class DtConsumptionIcon {
}

export declare class DtConsumptionLabel {
}

export declare class DtConsumptionModule {
}

export declare class DtConsumptionOverlay {
    _overlayTemplate: TemplateRef<void>;
}

export declare class DtConsumptionSubtitle {
}

export declare type DtConsumptionThemePalette = 'main' | 'warning' | 'error';

export declare class DtConsumptionTitle {
}

export declare class DtLegend {
}

export declare class DtLegendItem extends DtOverlayTrigger<{}> implements AfterContentInit, OnDestroy {
    _contentOverlayTemplateRef?: TemplateRef<{}>;
    _overlayTemplateRef?: TemplateRef<{}>;
    get hasOverlay(): boolean;
    constructor(overlay: DtOverlay, elementRef: ElementRef, zone: NgZone, focusMonitor: FocusMonitor, platform: Platform);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare class DtLegendModule {
}

export declare class DtLegendOverlay {
}

export declare class DtLegendSymbol {
}

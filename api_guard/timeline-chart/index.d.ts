export declare const DT_TIMELINE_CHART_DIRECTIVES: (typeof DtTimelineChartOverlayTitle | typeof DtTimelineChart)[];

export declare class DtTimelineChart implements AfterContentInit, OnDestroy {
    _keyTimingMarkers: QueryList<DtTimelineChartKeyTimingMarker>;
    _renderBars: number[];
    _renderKeyTimingMarkers: {
        position: number;
        marker: DtTimelineChartKeyTimingMarker;
    }[];
    _renderTicks: {
        position: number;
        value: number;
    }[];
    _renderTimingMarkers: {
        position: number;
        marker: DtTimelineChartTimingMarker;
    }[];
    _timingMarkers: QueryList<DtTimelineChartTimingMarker>;
    unit: string;
    get value(): number;
    set value(value: number);
    constructor(_changeDetectorRef: ChangeDetectorRef, _viewportResizer: DtViewportResizer, _elementRef: ElementRef);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare class DtTimelineChartKeyTimingMarker extends DtTimelineChartMarker {
}

export declare class DtTimelineChartMarker {
    _contentPortal: CdkPortal;
    get _hasOverlay(): boolean;
    _overlayTemplate: TemplateRef<{}>;
    _overlayText: DtTimelineChartOverlayText;
    _overlayTitle: DtTimelineChartOverlayTitle;
    identifier: string;
    get value(): number;
    set value(value: number);
}

export declare class DtTimelineChartModule {
}

export declare class DtTimelineChartOverlayText {
}

export declare class DtTimelineChartOverlayTitle {
}

export declare class DtTimelineChartTimingMarker extends DtTimelineChartMarker {
}

export declare const DT_EVENT_CHART_COLORS: string[];

export declare const DT_EVENT_CHART_DIRECTIVES: (typeof DtEventChartOverlay | typeof DtEventChart)[];

export declare class DtEventChart<T> implements AfterContentInit, OnInit, OnDestroy {
    _canvasEl: ElementRef;
    _events: QueryList<DtEventChartEvent<T>>;
    _laneLabelsEl: ElementRef;
    _lanes: QueryList<DtEventChartLane>;
    _lanesReversed: DtEventChartLane[];
    _legend: DtEventChartLegend<T>;
    _legendItems: QueryList<DtEventChartLegendItem>;
    _patternDefsTemplate: TemplateRef<{
        $implicit: string[];
    }>;
    _renderEvents: RenderEvent<T>[];
    _renderLanes: {
        y: number;
        lane: DtEventChartLane;
    }[];
    _renderPath: string | null;
    _renderTicks: {
        x: number;
        value: string | DtFormattedValue;
    }[];
    _selectedEventIndex: number | undefined;
    _svgHeight: number;
    _svgPlotHeight: number;
    _svgViewBox: string;
    _svgWidth: number;
    constructor(_resizer: DtViewportResizer, _changeDetectorRef: ChangeDetectorRef, _zone: NgZone, _viewContainerRef: ViewContainerRef, _componentFactoryResolver: ComponentFactoryResolver, _appRef: ApplicationRef, _injector: Injector, _overlayService: Overlay, _document: any, _platform: Platform, _elementRef: ElementRef<HTMLElement>, _config?: DtUiTestConfiguration | undefined);
    _calculateEventOutline(renderEvent: RenderEvent<T>, offset?: number): string;
    _eventSelected(event: MouseEvent | KeyboardEvent, renderEvent: RenderEvent<T>): void;
    _getRepresentingEvent(renderEvent: RenderEvent<T>): DtEventChartEvent<T>;
    _handleEventKeyDown(keyEvent: KeyboardEvent, renderEvent: RenderEvent<T>): void;
    _handleEventMouseEnter(event: MouseEvent, renderEvent: RenderEvent<T>): void;
    _handleEventMouseLeave(): void;
    _isSelected(renderEvent: RenderEvent<T>): boolean;
    _renderEventTrackByFn(index: number, _item: RenderEvent<T>): number;
    _resetEventSelection(): void;
    closeOverlay(): void;
    deselect(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    select(index: number): void;
}

export declare type DtEventChartColors = 'default' | 'error' | 'conversion' | 'filtered';

export declare class DtEventChartEvent<T> implements OnChanges, OnDestroy {
    _stateChanges$: Subject<void>;
    color: DtEventChartColors | undefined;
    data: T;
    get duration(): number;
    set duration(value: number);
    lane: string;
    readonly selected: EventEmitter<DtEventChartSelectedEvent<T>>;
    get value(): number;
    set value(value: number);
    ngOnChanges(): void;
    ngOnDestroy(): void;
}

export declare class DtEventChartLane implements OnChanges, OnDestroy {
    _stateChanges$: Subject<void>;
    color: DtEventChartColors;
    label: string;
    name: string;
    get pattern(): boolean;
    set pattern(value: boolean);
    ngOnChanges(): void;
    ngOnDestroy(): void;
}

export declare class DtEventChartLegend<T> implements OnChanges {
    _renderLegendItems: {
        color: string;
        item: DtEventChartLegendItem;
        pattern: boolean;
    }[];
    legendItems: DtEventChartLegendItem[];
    renderedEvents: RenderEvent<T>[];
    constructor(_changeDetectorRef: ChangeDetectorRef);
    _updateRenderLegendItems(): void;
    ngOnChanges(): void;
}

export declare class DtEventChartLegendItem implements OnChanges, OnDestroy {
    _contentTemplate: TemplateRef<void>;
    _stateChanges$: Subject<void>;
    color: DtEventChartColors;
    lanes: string[] | string;
    get pattern(): boolean;
    set pattern(value: boolean);
    ngOnChanges(): void;
    ngOnDestroy(): void;
}

export declare class DtEventChartModule {
}

export declare class DtEventChartOverlay {
}

export declare class DtEventChartSelectedEvent<T> {
    sources: DtEventChartEvent<T>[];
    constructor(sources: DtEventChartEvent<T>[]);
}

export interface RenderEvent<T> {
    color: DtEventChartColors;
    events: DtEventChartEvent<T>[];
    lane: string;
    mergedWith?: number[];
    originalIndex?: number;
    pattern: boolean;
    x1: number;
    x2: number;
    y: number;
}

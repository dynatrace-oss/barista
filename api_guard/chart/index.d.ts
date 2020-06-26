export declare class _DtChartSelectionArea implements AfterContentInit, OnDestroy {
    _hairline: ElementRef<HTMLDivElement>;
    constructor(_chart: DtChart, _elementRef: ElementRef<HTMLElement>, _focusTrapFactory: FocusTrapFactory, _overlay: Overlay, _zone: NgZone, _viewportRuler: ViewportRuler, _platform: Platform, _overlayContainer: OverlayContainer, _changeDetectorRef: ChangeDetectorRef, _document: any, _viewportResizer: DtViewportResizer);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare const _DtHeatfieldMixinBase: Constructor<CanColor<DtChartHeatfieldThemePalette>> & Constructor<DtHeatfieldBase>;

export declare const DT_CHART_CONFIG: InjectionToken<DtChartConfig>;

export declare const DT_CHART_DEFAULT_CONFIG: DtChartConfig;

export declare const DT_CHART_RESOLVER: InjectionToken<() => DtChart>;

export declare function DT_CHART_RESOVER_PROVIDER_FACTORY(c: DtChart): DtChartResolver;

export declare class DtChart implements AfterViewInit, OnDestroy, OnChanges, AfterContentInit {
    readonly _afterRender: Subject<void>;
    _chartObject: Chart | null;
    _container: ElementRef<HTMLElement>;
    _elementRef: ElementRef;
    _hasSelectionArea: boolean;
    _heatfields: QueryList<DtChartHeatfield>;
    _highChartsTooltipClosed$: Subject<void>;
    _highChartsTooltipDataChanged$: Subject<DtChartTooltipEvent>;
    _highChartsTooltipOpened$: Subject<DtChartTooltipEvent>;
    get _isLoading(): boolean;
    _plotBackground$: BehaviorSubject<SVGRectElement | null>;
    _plotBackgroundChartOffset: number;
    _range?: DtChartRange;
    _timestamp?: DtChartTimestamp;
    _tooltip: QueryList<DtChartTooltip>;
    get highchartsOptions(): HighchartsOptions;
    loadingText: string;
    get options(): Observable<DtChartOptions> | DtChartOptions;
    set options(options: Observable<DtChartOptions> | DtChartOptions);
    get series(): Observable<DtChartSeries[]> | DtChartSeries[] | undefined;
    set series(series: Observable<DtChartSeries[]> | DtChartSeries[] | undefined);
    get seriesIds(): Array<string | undefined> | undefined;
    readonly seriesVisibilityChange: EventEmitter<DtChartSeriesVisibilityChangeEvent>;
    readonly tooltipDataChange: EventEmitter<DtChartTooltipEvent>;
    readonly tooltipOpenChange: EventEmitter<boolean>;
    readonly updated: EventEmitter<void>;
    constructor(_changeDetectorRef: ChangeDetectorRef, _ngZone: NgZone, _viewportResizer: DtViewportResizer, _theme: DtTheme, _config: DtChartConfig,
    _elementRef: ElementRef);
    _resetHighchartsPointer(): void;
    _toggleTooltip(enabled: boolean): void;
    _update(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
}

export interface DtChartConfig {
    shouldUpdateColors: boolean;
}

export declare class DtChartHeatfield extends _DtHeatfieldMixinBase implements CanColor<DtChartHeatfieldThemePalette>, OnDestroy {
    _backdrop: ElementRef;
    _boundingBox: PlotBackgroundInfo;
    get _isValidStartEndRange(): boolean;
    _marker: ElementRef;
    _overlay: CdkConnectedOverlay;
    _overlayAnimationState: 'void' | 'fadeIn';
    _positions: ConnectedPosition[];
    get active(): boolean;
    set active(val: boolean);
    readonly activeChange: EventEmitter<DtChartHeatfieldActiveChange>;
    ariaLabel: string;
    ariaLabelledBy: string;
    get end(): number;
    set end(val: number);
    get start(): number;
    set start(val: number);
    constructor(elementRef: ElementRef, _changeDetectorRef: ChangeDetectorRef);
    _handleKeydown(event: KeyboardEvent): void;
    _initHeatfield(boundingBox: PlotBackgroundInfo, chartObject: Highcharts.Chart): void;
    _toggleActive(): void;
    ngOnDestroy(): void;
}

export declare class DtChartHeatfieldActiveChange {
    source: DtChartHeatfield;
    constructor(
    source: DtChartHeatfield);
}

export declare type DtChartHeatfieldThemePalette = 'main' | 'error';

export declare class DtChartModule {
}

export declare type DtChartOptions = HighchartsOptions & {
    series?: undefined;
};

export declare class DtChartRange implements AfterViewInit, OnDestroy {
    get _area(): {
        left: number;
        width: number;
    };
    set _area(area: {
        left: number;
        width: number;
    });
    _ariaLabelClose: string;
    _ariaLabelLeftHandle: string;
    _ariaLabelRightHandle: string;
    _ariaLabelSelectedArea: string;
    readonly _closeOverlay: Subject<void>;
    readonly _handleDragStarted: Subject<DtSelectionAreaEventTarget>;
    get _hidden(): boolean;
    set _hidden(hidden: boolean);
    _maxValue: number | null;
    _maxWidth: number;
    _minValue: number | null;
    _overlayTemplate: TemplateRef<{}>;
    _pixelsToValue: ((pixel: number, paneCoordinates?: boolean) => number) | null;
    _plotBackgroundChartOffset: number;
    _rangeElementRef: QueryList<ElementRef<HTMLDivElement>>;
    _selectedAreaFocusTrap: CdkTrapFocus;
    readonly _stateChanges: Subject<RangeStateChangedEvent>;
    readonly _switchToTimestamp: Subject<number>;
    get _valueToPixels(): ((value: number, paneCoordinates?: boolean) => number) | null;
    set _valueToPixels(fn: ((value: number, paneCoordinates?: boolean) => number) | null);
    _viewContainerRef: ViewContainerRef;
    get ariaLabelClose(): string;
    set ariaLabelClose(value: string);
    get ariaLabelLeftHandle(): string;
    set ariaLabelLeftHandle(value: string);
    get ariaLabelRightHandle(): string;
    set ariaLabelRightHandle(value: string);
    get ariaLabelSelectedArea(): string;
    set ariaLabelSelectedArea(value: string);
    readonly closed: EventEmitter<void>;
    get max(): number | null;
    set max(max: number | null);
    get min(): number;
    set min(min: number);
    readonly valid: BehaviorSubject<boolean>;
    get value(): [number, number];
    set value(value: [number, number]);
    readonly valueChanges: EventEmitter<[number, number]>;
    constructor(_viewContainerRef: ViewContainerRef, _elementRef: ElementRef<HTMLElement>, _changeDetectorRef: ChangeDetectorRef);
    _calculateMinWidth(left: number): number;
    _dragHandle(event: MouseEvent, type: string): void;
    _emitDragEnd(): void;
    _getRangeValuesFromPixels(left: number, width: number): [number, number] | undefined;
    _handleKeyDown(event: KeyboardEvent, handle: string): void;
    _handleOverlayClose(): void;
    _isRangeValid(start: number, end: number): boolean;
    _reflectRangeReleased(add: boolean): void;
    _reflectToDom(): void;
    _reset(): void;
    close(): void;
    focus(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}

export declare type DtChartResolver = () => DtChart;

export declare class DtChartSelectionAreaAction {
}

export declare type DtChartSeries = SeriesBarOptions | SeriesColumnOptions | SeriesLineOptions | SeriesAreaOptions | SeriesArearangeOptions | SeriesPieOptions;

export interface DtChartSeriesVisibilityChangeEvent {
    series: DtChartSeries;
    source: DtChart;
    visible: boolean;
}

export declare class DtChartTimestamp implements AfterViewInit, OnDestroy {
    _ariaLabelClose: string;
    _ariaLabelSelected: string;
    readonly _closeOverlay: Subject<void>;
    get _hidden(): boolean;
    set _hidden(hidden: boolean);
    _maxValue: number | null;
    _minValue: number | null;
    _overlayTemplate: TemplateRef<unknown>;
    _pixelsToValue: ((pixel: number, paneCoordinates?: boolean) => number) | null;
    _plotBackgroundChartOffset: number;
    get _position(): number;
    set _position(position: number);
    _selectedFocusTrap: CdkTrapFocus;
    readonly _stateChanges: Subject<TimestampStateChangedEvent>;
    readonly _switchToRange: Subject<number>;
    _timestampElementRef: QueryList<ElementRef<HTMLDivElement>>;
    get _valueToPixels(): ((value: number, paneCoordinates?: boolean) => number) | null;
    set _valueToPixels(fn: ((value: number, paneCoordinates?: boolean) => number) | null);
    _viewContainerRef: ViewContainerRef;
    get ariaLabelClose(): string;
    set ariaLabelClose(value: string);
    get ariaLabelSelected(): string;
    set ariaLabelSelected(value: string);
    readonly closed: EventEmitter<void>;
    get value(): number;
    set value(value: number);
    readonly valueChanges: EventEmitter<number>;
    constructor(_viewContainerRef: ViewContainerRef, _changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef<HTMLElement>);
    _emitStateChanges(): void;
    _emitValueChanges(): void;
    _handleKeyUp(event: KeyboardEvent): void;
    _handleOverlayClose(): void;
    _reset(): void;
    close(): void;
    focus(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}

export declare class DtChartTooltip implements OnDestroy {
    _overlayTemplate: TemplateRef<void>;
    constructor(_overlay: Overlay, _viewContainerRef: ViewContainerRef, _changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef<HTMLElement>, _config?: DtUiTestConfiguration | undefined);
    _createOverlay(data: DtChartTooltipData, parentChart: DtChart, plotBackgroundInfo: PlotBackgroundInfo): void;
    _dismiss(): void;
    _updateOverlayContext(data: DtChartTooltipData, parentChart: DtChart, plotBackgroundInfo: PlotBackgroundInfo): void;
    ngOnDestroy(): void;
}

export interface DtChartTooltipData {
    hoveredIndex?: number;
    point?: PointLabelObject;
    points?: PointLabelObject[];
    x?: number | string;
    y?: number;
}

export declare class DtHeatfieldBase {
    _elementRef: ElementRef;
    constructor(_elementRef: ElementRef);
}

export declare function getDtHeatfieldUnsupportedChartError(): Error;

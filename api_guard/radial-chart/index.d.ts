export declare class DtRadialChart implements AfterContentInit, OnDestroy {
    _backgroundPath: string;
    get _externalSelectionRadius(): number;
    _hasBackground: boolean;
    get _innerRadius(): number;
    get _internalSelectionRadius(): number;
    _overlay: TemplateRef<{
        $implicit: DtRadialChartOverlayData;
    }>;
    _radialChartSeries: QueryList<DtRadialChartSeries>;
    get _radius(): number;
    _renderData: DtRadialChartRenderData[];
    _selectable: boolean;
    _totalSeriesValue: number;
    get _viewBox(): string;
    _width: number;
    get legendPosition(): 'right' | 'bottom';
    set legendPosition(value: 'right' | 'bottom');
    get maxValue(): number | null;
    set maxValue(value: number | null);
    get selectable(): boolean;
    set selectable(value: boolean);
    get type(): 'pie' | 'donut';
    set type(value: 'pie' | 'donut');
    valueDisplayMode: 'absolute' | 'percent';
    constructor(_elementRef: ElementRef<HTMLElement>, _changeDetectorRef: ChangeDetectorRef, _platform: Platform, _sanitizer: DomSanitizer);
    _getSeriesRenderData(series: DtRadialChartSeries, arcData: PieArcDatum<number>, chartColor: string, totalSeriesValue: number): DtRadialChartRenderData;
    _sanitizeCSS(prop: string, value: string | number | DtColors): SafeStyle;
    _select(series?: DtRadialChartRenderData): void;
    _updateDimensions(): void;
    _updateRenderData(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare class DtRadialChartModule {
}

export declare class DtRadialChartOverlay {
}

export declare class DtRadialChartSeries implements OnChanges, OnDestroy {
    _stateChanges$: BehaviorSubject<DtRadialChartSeries>;
    get color(): string | null;
    set color(value: string | null);
    name: string;
    selected: boolean;
    selectedChange: EventEmitter<boolean>;
    value: number;
    ngOnChanges(): void;
    ngOnDestroy(): void;
}

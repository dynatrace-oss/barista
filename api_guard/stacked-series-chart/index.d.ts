export declare class DtStackedSeriesChart implements OnDestroy {
    _axisTicks: {
        pos: number;
        value: number;
        valueRelative: number;
    }[];
    _canShowValue: boolean;
    _legends: DtStackedSeriesChartLegend[];
    _mode: DtStackedSeriesChartMode;
    _overlay: TemplateRef<DtStackedSeriesChartTooltipData>;
    _selectable: boolean;
    _tracks: DtStackedSeriesChartFilledSeries[];
    _valueAxis: any;
    _valueAxisSize: {
        absolute: number;
        relative: number;
    };
    get fillMode(): DtStackedSeriesChartFillMode;
    set fillMode(value: DtStackedSeriesChartFillMode);
    get legends(): DtStackedSeriesChartLegend[] | undefined;
    set legends(value: DtStackedSeriesChartLegend[] | undefined);
    get max(): number | undefined;
    set max(value: number | undefined);
    maxTrackSize: number;
    get mode(): DtStackedSeriesChartMode;
    set mode(value: DtStackedSeriesChartMode);
    get selectable(): boolean;
    set selectable(value: boolean);
    get selected(): [DtStackedSeriesChartSeries, DtStackedSeriesChartNode] | [];
    set selected([series, node]: [DtStackedSeriesChartSeries, DtStackedSeriesChartNode] | []);
    selectedChange: EventEmitter<[DtStackedSeriesChartSeries, DtStackedSeriesChartNode] | []>;
    get series(): DtStackedSeriesChartSeries[];
    set series(value: DtStackedSeriesChartSeries[]);
    valueDisplayMode: DtStackedSeriesChartValueDisplayMode;
    visibleLabel: boolean;
    visibleLegend: boolean;
    visibleTrackBackground: boolean;
    visibleValueAxis: boolean;
    constructor(_changeDetectorRef: ChangeDetectorRef, _resizer: DtViewportResizer, _zone: NgZone, _overlayService: DtOverlay,
    _sanitizer: DomSanitizer, _theme: DtTheme);
    _handleOnSeriesMouseEnter(event: MouseEvent, slice: DtStackedSeriesChartTooltipData): void;
    _handleOnSeriesMouseLeave(): void;
    _handleOnSeriesMouseMove(event: MouseEvent): void;
    _sanitizeCSS(styles: [string, string | number | DtColors][]): SafeStyle;
    _toggleLegend(slice: DtStackedSeriesChartLegend): void;
    _toggleSelect(series?: DtStackedSeriesChartSeries, node?: DtStackedSeriesChartNode): void;
    _trackByFn(_: number, item: DtStackedSeriesChartTooltipData | DtStackedSeriesChartFilledSeries): string;
    ngOnDestroy(): void;
}

export declare type DtStackedSeriesChartFillMode = 'full' | 'relative';

export interface DtStackedSeriesChartLegend {
    color: DtColors | string;
    label: string;
    visible: boolean;
}

export declare type DtStackedSeriesChartMode = 'bar' | 'column';

export declare class DtStackedSeriesChartModule {
}

export interface DtStackedSeriesChartNode {
    color?: DtColors | string;
    label: string;
    value: number;
}

export interface DtStackedSeriesChartSeries {
    label: string;
    nodes: DtStackedSeriesChartNode[];
}

export interface DtStackedSeriesChartTooltipData {
    ariaLabel?: string;
    color: DtColors | string;
    length?: string;
    origin: DtStackedSeriesChartNode;
    selected: boolean;
    seriesOrigin: DtStackedSeriesChartSeries;
    valueRelative: number;
    visible: boolean;
}

export declare type DtStackedSeriesChartValueDisplayMode = 'none' | 'absolute' | 'percent';

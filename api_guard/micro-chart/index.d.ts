export declare function DT_MICROCHART_CHART_RESOVER_PROVIDER_FACTORY(microChart: DtMicroChart): DtChartResolver;

export declare class DtMicroChart implements OnDestroy {
    _dtChart: DtChart;
    _transformedOptions: DtMicroChartOptions;
    _transformedSeries: Observable<DtMicroChartSeries[]> | DtMicroChartSeries[];
    get highchartsOptions(): Options;
    get labelFormatter(): (input: number) => string;
    set labelFormatter(formatter: (input: number) => string);
    get options(): DtMicroChartOptions;
    set options(options: DtMicroChartOptions);
    get series(): Observable<DtMicroChartSeries[] | DtMicroChartSeries> | DtMicroChartSeries[] | DtMicroChartSeries;
    set series(series: Observable<DtMicroChartSeries[] | DtMicroChartSeries> | DtMicroChartSeries[] | DtMicroChartSeries);
    get seriesId(): string | undefined;
    readonly updated: EventEmitter<void>;
    constructor(_theme: DtTheme, _changeDetectorRef: ChangeDetectorRef);
    ngOnDestroy(): void;
}

export declare class DtMicroChartModule {
}

export declare type DtMicroChartOptions = DtChartOptions & {
    interpolateGaps?: boolean;
};

export declare type DtMicroChartSeries = SeriesLineOptions | SeriesColumnOptions;

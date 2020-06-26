export declare class DtSunburstChart {
    _selectedLabel: string;
    _selectedRelativeValue: number;
    _selectedValue: number;
    _slices: DtSunburstChartSlice[];
    _svgEl: any;
    _valueAsAbsolute: boolean;
    readonly _viewBox: string;
    noSelectionLabel: string;
    get selected(): DtSunburstChartNode[];
    set selected(value: DtSunburstChartNode[]);
    selectedChange: EventEmitter<DtSunburstChartNode[]>;
    get series(): DtSunburstChartNode[];
    set series(value: DtSunburstChartNode[]);
    set valueDisplayMode(value: 'absolute' | 'percent');
    constructor(_overlayService: Overlay, _viewContainerRef: ViewContainerRef, _platform: Platform, _sanitizer: DomSanitizer, _elementRef?: ElementRef<HTMLElement> | undefined, _config?: DtUiTestConfiguration | undefined);
    _sanitizeCSS(prop: string, value: string | number | DtColors): SafeStyle;
    _select(event?: MouseEvent, slice?: DtSunburstChartSlice): void;
    closeOverlay(): void;
    openOverlay(node: DtSunburstChartSlice): void;
}

export declare class DtSunburstChartModule {
}

export interface DtSunburstChartNode {
    children?: DtSunburstChartNode[];
    color?: DtColors | string;
    label: string;
    value?: number;
}

export interface DtSunburstChartTooltipData {
    active: boolean;
    children?: DtSunburstChartTooltipData[];
    color: DtColors | string;
    colorHover: DtColors | string;
    depth: number;
    id: string;
    isCurrent: boolean;
    label: string;
    origin: DtSunburstChartNode;
    showLabel: boolean;
    value: number;
    valueRelative: number;
    visible: boolean;
}

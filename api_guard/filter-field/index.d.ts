export declare function applyDtOptionIds(def: DtNodeDef<unknown>, prefix?: string, skipRootDef?: boolean): void;

export declare const DELIMITER = "\u25EC";

export declare const DT_FILTER_FIELD_TYPING_DEBOUNCE = 200;

export declare function dtAutocompleteDef<D = unknown, OG = unknown, Op = unknown>(data: D, existingNodeDef: DtNodeDef | null, optionsOrGroups: DtNodeDef<OG>[], distinct: boolean, async: boolean, partial?: boolean): DtNodeDef<D> & {
    autocomplete: DtAutocompleteDef<OG, Op>;
};

export interface DtAutocompleteDef<OpGr = unknown, Op = unknown> {
    async: boolean;
    distinct: boolean;
    operators: DtNodeDef<Op>[];
    optionsOrGroups: DtNodeDef<OpGr>[];
    partial?: boolean;
}

export declare class DtFilterField<T = any> implements CanDisable, AfterViewInit, OnDestroy, OnChanges {
    _asyncDefs: Map<DtNodeDef<unknown>, DtNodeDef<unknown>>;
    _autocomplete: DtAutocomplete<DtNodeDef>;
    _autocompleteOptionsOrGroups: DtNodeDef[];
    _autocompleteTrigger: DtAutocompleteTrigger<DtNodeDef>;
    _control: DtFilterFieldControl | null;
    _currentDef: DtNodeDef | null;
    _currentFilterValues: _DtFilterValue[];
    _errors: string[];
    _filterByLabel: string;
    _filterfieldRange: DtFilterFieldRange;
    _filterfieldRangeTrigger: DtFilterFieldRangeTrigger;
    _inputEl: ElementRef;
    _inputValue: string;
    _prefixTagData: _DtFilterFieldTagData[];
    _rootDef: DtNodeDef | null;
    get _showClearAll(): boolean;
    _suffixTagData: _DtFilterFieldTagData[];
    ariaLabel: string;
    clearAllLabel: string;
    readonly currentFilterChanges: EventEmitter<DtFilterFieldCurrentFilterChangeEvent<T>>;
    currentTags: Observable<DtFilterFieldTag[]>;
    get dataSource(): DtFilterFieldDataSource<T>;
    set dataSource(dataSource: DtFilterFieldDataSource<T>);
    get disabled(): boolean;
    set disabled(value: boolean);
    errorStateMatcher: ErrorStateMatcher;
    readonly filterChanges: EventEmitter<DtFilterFieldChangeEvent<T>>;
    get filters(): any[][];
    set filters(value: any[][]);
    readonly inputChange: EventEmitter<string>;
    label: string;
    get loading(): boolean;
    set loading(value: boolean);
    tagData: _DtFilterFieldTagData[];
    constructor(_changeDetectorRef: ChangeDetectorRef, _zone: NgZone, _focusMonitor: FocusMonitor, _elementRef: ElementRef, _document: any, defaultErrorStateMatcher: ErrorStateMatcher);
    _clearAll(event: Event): void;
    _handleHostClick(event: MouseEvent): void;
    _handleInputChange(): void;
    _handleInputKeyDown(event: KeyboardEvent): void;
    _handleRangeSubmitted(event: DtFilterFieldRangeSubmittedEvent): void;
    _handleTagEdit(event: DtFilterFieldTag): void;
    _handleTagRemove(event: DtFilterFieldTag): void;
    focus(): void;
    getTagForFilter(needle: any[]): DtFilterFieldTag | null;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
}

export declare class DtFilterFieldChangeEvent<T> {
    added: T[][];
    filters: T[][];
    removed: T[][];
    source: DtFilterField<T>;
    constructor(source: DtFilterField<T>,
    added: T[][],
    removed: T[][],
    filters: T[][]);
}

export declare class DtFilterFieldCurrentFilterChangeEvent<T> {
    added: T[];
    currentFilter: T[];
    filters: T[][];
    removed: T[];
    source: DtFilterField<T>;
    constructor(source: DtFilterField<T>, added: T[], removed: T[], currentFilter: T[], filters: T[][]);
}

export declare abstract class DtFilterFieldDataSource<T> {
    abstract connect(): Observable<DtNodeDef<T> | null>;
    abstract disconnect(): void;
    abstract isAutocomplete(data: any): boolean;
    abstract isFreeText(data: any): boolean;
    abstract isGroup(data: any): boolean;
    abstract isOption(data: any): boolean;
    abstract isRange(data: any): boolean;
    abstract transformAutocomplete(data: T, parent: DtNodeDef<T> | null, existingDef: DtNodeDef<T> | null): DtNodeDef<T>;
    abstract transformFreeText(data: T, parent: DtNodeDef<T> | null, existingDef: DtNodeDef<T> | null): DtNodeDef;
    abstract transformGroup(data: T, parentAutocomplete: DtNodeDef<T> | null, existingDef: DtNodeDef<T> | null): DtNodeDef<T>;
    abstract transformList(list: any[], parent: DtNodeDef<T> | null): DtNodeDef<T>[];
    abstract transformObject(data: T | null, parent: DtNodeDef<T> | null): DtNodeDef<T> | null;
    abstract transformOption(data: T, parentAutocompleteOrOption: DtNodeDef<T> | null, existingDef: DtNodeDef<T> | null): DtNodeDef<T>;
    abstract transformRange(data: any, parent: DtNodeDef<T> | null, existingDef: DtNodeDef<T> | null): DtNodeDef;
}

export declare class DtFilterFieldDefaultDataSource implements DtFilterFieldDataSource<DtFilterFieldDefaultDataSourceType> {
    get data(): DtFilterFieldDefaultDataSourceType | null;
    set data(data: DtFilterFieldDefaultDataSourceType | null);
    constructor(initialData?: DtFilterFieldDefaultDataSourceType);
    connect(): Observable<DtNodeDef<DtFilterFieldDefaultDataSourceType> | null>;
    disconnect(): void;
    isAutocomplete(data: any): data is DtFilterFieldDefaultDataSourceAutocomplete;
    isFreeText(data: any): data is DtFilterFieldDefaultDataSourceFreeText;
    isGroup(data: any): data is DtFilterFieldDefaultDataSourceGroup;
    isOption(data: any): data is DtFilterFieldDefaultDataSourceOption;
    isRange(data: any): data is DtFilterFieldDefaultDataSourceRange;
    transformAutocomplete(data: DtFilterFieldDefaultDataSourceAutocomplete): DtNodeDef<DtFilterFieldDefaultDataSourceAutocomplete>;
    transformFreeText(data: DtFilterFieldDefaultDataSourceFreeText): DtNodeDef<DtFilterFieldDefaultDataSourceFreeText>;
    transformGroup(data: DtFilterFieldDefaultDataSourceGroup, parentAutocomplete?: DtNodeDef<DtFilterFieldDefaultDataSourceType> | null, existingDef?: DtNodeDef<DtFilterFieldDefaultDataSourceType> | null): DtNodeDef<DtFilterFieldDefaultDataSourceGroup>;
    transformList(list: Array<DtFilterFieldDefaultDataSourceType>, parent?: DtNodeDef<DtFilterFieldDefaultDataSourceType> | null): DtNodeDef<DtFilterFieldDefaultDataSourceType>[];
    transformObject(data: DtFilterFieldDefaultDataSourceType | null, parent?: DtNodeDef<DtFilterFieldDefaultDataSourceType> | null): DtNodeDef<DtFilterFieldDefaultDataSourceType> | null;
    transformOption(data: DtFilterFieldDefaultDataSourceOption, parentAutocompleteOrOption?: DtNodeDef<DtFilterFieldDefaultDataSourceType> | null, existingDef?: DtNodeDef<DtFilterFieldDefaultDataSourceType> | null): DtNodeDef<DtFilterFieldDefaultDataSourceOption>;
    transformRange(data: DtFilterFieldDefaultDataSourceRange): DtNodeDef<DtFilterFieldDefaultDataSourceRange>;
}

export interface DtFilterFieldDefaultDataSourceAutocomplete {
    async?: boolean;
    autocomplete: Array<DtFilterFieldDefaultDataSourceOption | DtFilterFieldDefaultDataSourceGroup>;
    distinct?: boolean;
    partial?: boolean;
}

export interface DtFilterFieldDefaultDataSourceFreeText {
    suggestions: Array<DtFilterFieldDefaultDataSourceSimpleOption | DtFilterFieldDefaultDataSourceSimpleGroup>;
    unique?: boolean;
    validators: DtFilterFieldValidator[];
}

export interface DtFilterFieldDefaultDataSourceGroup extends DtFilterFieldDefaultDataSourceSimpleGroup {
    options: Array<DtFilterFieldDefaultDataSourceOption>;
}

export declare type DtFilterFieldDefaultDataSourceOption = DtFilterFieldDefaultDataSourceSimpleOption | (DtFilterFieldDefaultDataSourceAutocomplete & DtFilterFieldDefaultDataSourceSimpleOption) | (DtFilterFieldDefaultDataSourceFreeText & DtFilterFieldDefaultDataSourceSimpleOption) | (DtFilterFieldDefaultDataSourceRange & DtFilterFieldDefaultDataSourceSimpleOption);

export interface DtFilterFieldDefaultDataSourceRange {
    range: {
        unit: string;
        operators: {
            range?: boolean;
            equal?: boolean;
            greaterThanEqual?: boolean;
            lessThanEqual?: boolean;
        };
    };
    unique?: boolean;
}

export interface DtFilterFieldDefaultDataSourceSimpleGroup {
    name: string;
    options: Array<DtFilterFieldDefaultDataSourceSimpleOption>;
}

export interface DtFilterFieldDefaultDataSourceSimpleOption {
    name: string;
}

export declare type DtFilterFieldDefaultDataSourceType = DtFilterFieldDefaultDataSourceOption | DtFilterFieldDefaultDataSourceGroup | DtFilterFieldDefaultDataSourceAutocomplete | DtFilterFieldDefaultDataSourceFreeText | DtFilterFieldDefaultDataSourceRange;

export declare class DtFilterFieldModule {
}

export declare class DtFilterFieldRange implements AfterViewInit {
    _hasEqualOperator: boolean;
    _hasGreaterEqualOperator: boolean;
    _hasLowerEqualOperator: boolean;
    _hasRangeOperator: boolean;
    _isOpen: boolean;
    _operatorGroup: DtButtonGroup<DtFilterFieldRange>;
    _portal: TemplatePortal;
    _selectedOperator: DtFilterFieldRangeOperator | null;
    _template: TemplateRef<{}>;
    _valueFrom: string;
    _valueTo: string;
    readonly closed: EventEmitter<void>;
    get enabledOperators(): DtRangeOperatorFlags;
    set enabledOperators(value: DtRangeOperatorFlags);
    id: string;
    get isOpen(): boolean;
    readonly opened: EventEmitter<void>;
    readonly rangeSubmitted: EventEmitter<DtFilterFieldRangeSubmittedEvent>;
    unit: string;
    constructor(_viewContainerRef: ViewContainerRef, _changeDetectorRef: ChangeDetectorRef);
    _getLocalId(suffix: string): string;
    _handleSubmit(event: Event): void;
    _isOperatorType(type: DtFilterFieldRangeOperator): boolean;
    _isValidRange(): boolean;
    _markForCheck(): void;
    _setOperator(operator?: DtFilterFieldRangeOperator): void;
    _setValues(values: number | [number, number]): void;
    focus(): void;
    ngAfterViewInit(): void;
}

export declare type DtFilterFieldRangeOperator = 'range' | 'lower-equal' | 'greater-equal' | 'equal';

export declare class DtFilterFieldRangeSubmittedEvent {
    operator: DtFilterFieldRangeOperator;
    range: number | [number, number];
    source: DtFilterFieldRange;
    unit: string;
    constructor(
    source: DtFilterFieldRange,
    operator: DtFilterFieldRangeOperator,
    range: number | [number, number],
    unit: string);
}

export declare class DtFilterFieldRangeTrigger implements OnDestroy {
    get panelClosingActions(): Observable<null>;
    get panelOpen(): boolean;
    get range(): DtFilterFieldRange;
    set range(value: DtFilterFieldRange);
    get rangeDisabled(): boolean;
    set rangeDisabled(value: boolean);
    constructor(_elementRef: ElementRef, _overlay: Overlay, _changeDetectorRef: ChangeDetectorRef, _viewportRuler: ViewportRuler, _platform: Platform, _overlayContainer: OverlayContainer, zone: NgZone, _document: any);
    _handleFocus(): void;
    closePanel(shouldEmit?: boolean): void;
    ngOnDestroy(): void;
    openPanel(): void;
}

export declare class DtFilterFieldTag implements OnDestroy {
    get _filterFieldDisabled(): boolean;
    set _filterFieldDisabled(value: boolean);
    _overlayConfig: DtOverlayConfig;
    _tooltipDisabled: boolean;
    _valueSpan: ElementRef<HTMLSpanElement>;
    get data(): _DtFilterFieldTagData;
    set data(value: _DtFilterFieldTagData);
    get deletable(): boolean;
    set deletable(value: boolean);
    get disabled(): boolean;
    set disabled(value: boolean);
    readonly edit: EventEmitter<DtFilterFieldTag>;
    get editable(): boolean;
    set editable(value: boolean);
    readonly remove: EventEmitter<DtFilterFieldTag>;
    constructor(_changeDetectorRef: ChangeDetectorRef, _platform: Platform, _zone: NgZone);
    _handleEdit(event: MouseEvent): void;
    _handleRemove(event: MouseEvent): void;
    ngOnDestroy(): void;
}

export declare function dtFreeTextDef<D = unknown, S = unknown>(data: D, existingNodeDef: DtNodeDef | null, suggestions: DtNodeDef<S>[], validators: DtFilterFieldValidator[], unique: boolean): DtNodeDef<D> & {
    freeText: DtFreeTextDef<S>;
};

export interface DtFreeTextDef<S = unknown> {
    suggestions: DtNodeDef<S>[];
    unique: boolean;
    validators: DtFilterFieldValidator[];
}

export declare function dtGroupDef<D = unknown, O = unknown>(data: D, existingNodeDef: DtNodeDef | null, label: string, options: DtNodeDef<O>[], parentAutocomplete: DtNodeDef<unknown> | null): DtNodeDef<D> & {
    group: DtGroupDef<O>;
};

export interface DtGroupDef<O = unknown> {
    label: string;
    options: DtNodeDef<O>[];
    parentAutocomplete: DtNodeDef<unknown> | null;
}

export interface DtNodeDef<D = unknown> {
    autocomplete: DtAutocompleteDef | null;
    data: D;
    freeText: DtFreeTextDef | null;
    group: DtGroupDef | null;
    nodeFlags: DtNodeFlags;
    operator: DtOperatorDef | null;
    option: DtOptionDef | null;
    range: DtRangeDef | null;
}

export declare enum DtNodeFlags {
    None = 0,
    TypeAutocomplete = 1,
    TypeFreeText = 2,
    TypeOption = 4,
    TypeGroup = 8,
    TypeRange = 16,
    RenderTypes = 19,
    Types = 15
}

export declare function dtOptionDef<D = unknown>(data: D, existingNodeDef: DtNodeDef | null, viewValue: string, uid: string | null, parentAutocomplete: DtNodeDef<unknown> | null, parentGroup: DtNodeDef<unknown> | null): DtNodeDef<D> & {
    option: DtOptionDef;
};

export interface DtOptionDef {
    parentAutocomplete: DtNodeDef<unknown> | null;
    parentGroup: DtNodeDef<unknown> | null;
    uid: string | null;
    viewValue: string;
}

export declare function dtRangeDef<D = unknown>(data: D, existingNodeDef: DtNodeDef | null, hasRangeOperator: boolean, hasEqualOperator: boolean, hasGreaterEqualOperator: boolean, hasLowerEqualOperator: boolean, unit: string, unique: boolean): DtNodeDef<D> & {
    range: DtRangeDef;
};

export interface DtRangeDef {
    operatorFlags: DtRangeOperatorFlags;
    unique: boolean;
    unit: string;
}

export declare const enum DtRangeOperatorFlags {
    Equal = 1,
    LowerEqual = 2,
    GreatEqual = 4,
    Range = 8,
    Types = 15
}

export declare function getDtFilterFieldApplyFilterNoRootDataProvidedError(): Error;

export declare function getDtFilterFieldApplyFilterParseError(): Error;

export declare function getDtFilterFieldRangeDuplicatedOperatorError(operatorType: string): Error;

export declare function getDtFilterFieldRangeNoOperatorsError(): Error;

export declare function isDtAutocompleteDef<D = unknown, OpGr = unknown, Op = unknown>(def: DtNodeDef<D> | null): def is DtNodeDef<D> & {
    autocomplete: DtAutocompleteDef<OpGr, Op>;
};

export declare function isDtFreeTextDef<D = unknown, S = unknown>(def: DtNodeDef<D> | null): def is DtNodeDef<D> & {
    freeText: DtFreeTextDef<S>;
};

export declare function isDtGroupDef<D = unknown, O = unknown>(def: DtNodeDef<D> | null): def is DtNodeDef<D> & {
    group: DtGroupDef<O>;
};

export declare function isDtNodeDef<D = unknown>(def: any): def is DtNodeDef<D>;

export declare function isDtOptionDef<D>(def: DtNodeDef<D> | null): def is DtNodeDef<D> & {
    option: DtOptionDef;
};

export declare function isDtRangeDef<D = unknown>(def: DtNodeDef<D> | null): def is DtNodeDef<D> & DtRangeDef;

export declare function isDtRenderType<D>(def: DtNodeDef<D> | null): def is DtNodeDef<D>;

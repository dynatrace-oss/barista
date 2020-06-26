export declare const _DtOrderMixinBase: import("../../../core/dynatrace-barista-components-core").Constructor<CanDisable> & typeof DtOrderBase;

export declare const _DtSortHeaderMixinBase: import("../../../core/dynatrace-barista-components-core").Constructor<CanDisable> & typeof DtSortHeaderBase;

export declare const _DtSortMixinBase: import("../../../core/dynatrace-barista-components-core").Constructor<CanDisable> & typeof DtSortBase;

export declare class _DtTableBase<T> extends CdkTable<T> {
    protected _role: string;
    get interactiveRows(): boolean;
    set interactiveRows(value: boolean);
    constructor(differs: IterableDiffers, changeDetectorRef: ChangeDetectorRef, elementRef: ElementRef, document: any, platform: Platform, _role: string, interactiveRows?: boolean);
}

export declare class _DtTableBaseModule {
}

export declare function _setDtColumnCssClasses(columnDef: DtColumnDef, elementRef: ElementRef): void;

export declare function _updateDtColumnStyles(columnDef: DtColumnDef, elementRef: ElementRef): void;

export declare const DT_TABLE_SEARCH_CONTROL_VALUE_ACCESSOR: Provider;

export declare class DtCell implements AfterContentInit, OnDestroy {
    _changeDetectorRef: ChangeDetectorRef;
    _columnDef: DtColumnDef;
    _indicators: QueryList<DtIndicator>;
    _isSorted: boolean;
    _row: DtRow;
    _stateChanges: Subject<void>;
    get hasError(): boolean;
    get hasWarning(): boolean;
    constructor(_columnDef: DtColumnDef, _changeDetectorRef: ChangeDetectorRef, elem: ElementRef, dtSortable?: DtSort, _dtIndicator?: DtIndicator | undefined);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare class DtCellDef extends CdkCellDef {
}

export declare type DtColumnComparatorFunction<T> = (left: T, right: T) => number;

export declare class DtColumnDef extends CdkColumnDef implements OnChanges {
    _stateChanges: Subject<void>;
    align: DtTableColumnTypedAlign | DtTableColumnAlign;
    minWidth: string | number;
    name: string;
    proportion: number;
    ngOnChanges(): void;
}

export declare class DtExpandableCell extends DtCell {
    _row: DtExpandableRow;
    ariaLabel: string;
    ariaLabelledBy: string;
}

export declare class DtExpandableRow extends DtRow implements OnDestroy, AfterContentInit {
    readonly _collapsedStream: Observable<DtExpandableRowChangeEvent>;
    _expandableContentTemplate: TemplateRef<any> | null;
    readonly _expandedStream: Observable<DtExpandableRowChangeEvent>;
    readonly expandChange: EventEmitter<DtExpandableRowChangeEvent>;
    get expanded(): boolean;
    set expanded(value: boolean);
    constructor(_table: DtTable<any>, _changeDetectorRef: ChangeDetectorRef, _expansionDispatcher: UniqueSelectionDispatcher, elementRef: ElementRef);
    _collapse(): void;
    _expandViaInteraction(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare class DtExpandableRowChangeEvent {
    row: DtExpandableRow;
    constructor(row: DtExpandableRow);
}

export declare class DtExpandableRowContent {
}

export declare class DtFavoriteColumn<T> extends DtSimpleColumnBase<T> {
    readonly favoriteToggled: EventEmitter<T>;
    constructor(table: DtTable<T>);
    _isFavorite(data: T): boolean;
    _toggleFavorite(data: T): void;
}

export declare class DtHeaderCell implements OnDestroy {
    constructor(columnDef: DtColumnDef, elem: ElementRef);
    ngOnDestroy(): void;
}

export declare class DtHeaderCellDef extends CdkHeaderCellDef {
}

export declare class DtHeaderRow extends CdkHeaderRow {
}

export declare class DtHeaderRowDef extends CdkHeaderRowDef {
}

export declare class DtOrder<T> extends _DtOrderMixinBase implements CanDisable, AfterViewInit, OnChanges, OnDestroy {
    _disabledChange: BehaviorSubject<boolean>;
    readonly _dropList: CdkDropList<T[]>;
    readonly _reorder: Subject<DtOrderReorderEvent>;
    readonly _table: DtTable<T>;
    readonly orderChange: Observable<DtOrderChangeEvent>;
    constructor(_dropList: CdkDropList<T[]>, _table: DtTable<T>);
    _order(previousIndex: number, currentIndex: number, userTriggered?: boolean): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    order(currentIndex: number, targetIndex: number): void;
}

export declare class DtOrderBase {
}

export declare class DtOrderCell<T> extends DtCell implements AfterViewInit, OnChanges, OnDestroy {
    _animateOrderChangedIndicator: boolean;
    _orderFormControl: FormControl;
    _orderInput: ElementRef<HTMLInputElement>;
    index: string;
    constructor(columnDef: DtColumnDef, changeDetectorRef: ChangeDetectorRef, elem: ElementRef, _order: DtOrder<T>, _dtIndicator?: DtIndicator);
    _handleBlur(): void;
    _handleKeyup($event: KeyboardEvent): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
}

export interface DtOrderChangeEvent {
    currentIndex: number;
    previousIndex: number;
}

export interface DtOrderReorderEvent {
    data: DtOrderChangeEvent;
    userTriggered: boolean;
}

export declare class DtRow extends CdkRow implements OnDestroy {
    protected _cells: Set<DtCell>;
    protected _elementRef: ElementRef;
    _orderChangedIndicatorAnimationState: 'void' | 'changed';
    get _registeredCells(): DtCell[];
    constructor(_elementRef: ElementRef);
    _handleOrderChangedAnimationEvent($event: AnimationEvent): void;
    _registerCell(cell: DtCell): void;
    _unregisterCell(cell: DtCell): void;
    ngOnDestroy(): void;
    static _mostRecentRow: DtRow | null;
}

export declare class DtRowDef<T> extends CdkRowDef<T> {
}

export declare abstract class DtSimpleColumnBase<T> implements OnInit, OnChanges, OnDestroy {
    _cellDef: DtCellDef;
    _columnDef: DtColumnDef;
    _headerDef: DtHeaderCellDef;
    comparator: DtSimpleColumnComparatorFunction<T>;
    displayAccessor: DtSimpleColumnDisplayAccessorFunction<T>;
    formatter: DtSimpleColumnFormatFunction;
    hasProblem: DtSimpleColumnHasProblemFunction<T>;
    label: string;
    get name(): string;
    set name(name: string);
    proportion: number;
    sortAccessor: DtSimpleColumnSortAccessorFunction<T>;
    get sortable(): boolean;
    set sortable(sortable: boolean);
    table: DtTable<T>;
    constructor(table: DtTable<T>);
    _getData(data: T): any;
    _getIndicator(data: T): DtIndicatorThemePalette;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
}

export declare type DtSimpleColumnComparatorFunction<T> = (left: T, right: T, name: string) => number;

export declare type DtSimpleColumnDisplayAccessorFunction<T> = (data: T, name: string) => any;

export declare type DtSimpleColumnFormatFunction = (displayValue: any) => string | DtFormattedValue;

export declare type DtSimpleColumnHasProblemFunction<T> = (data: T, name: string) => DtIndicatorThemePalette;

export declare type DtSimpleColumnSortAccessorFunction<T> = (data: T, name: string) => string | number;

export declare class DtSimpleNumberColumn<T> extends DtSimpleColumnBase<T> {
    constructor(table: DtTable<T>);
    _getData(data: T): any;
}

export declare class DtSimpleOrderColumn<T> extends DtSimpleColumnBase<T> {
}

export declare class DtSimpleTextColumn<T> extends DtSimpleColumnBase<T> {
    constructor(table: DtTable<T>);
}

export declare class DtSort extends _DtSortMixinBase implements CanDisable, OnChanges, OnInit, OnDestroy {
    readonly _initialized: BehaviorSubject<boolean>;
    readonly _stateChanges: Subject<void>;
    active: string;
    get direction(): DtSortDirection;
    set direction(direction: DtSortDirection);
    readonly sortChange: EventEmitter<DtSortEvent>;
    start: DtSortDirection;
    getNextSortDirection(sortable: DtSortHeader): DtSortDirection;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    sort(sortable: DtSortHeader): void;
    sort(active: string, direction: DtSortDirection): void;
}

export declare type DtSortAccessorFunction<T> = (data: T) => any;

export declare class DtSortBase {
}

export interface DtSortEvent {
    active: string;
    direction: DtSortDirection;
}

export declare class DtSortHeader extends _DtSortHeaderMixinBase implements CanDisable, OnDestroy, OnInit {
    get _isDisabled(): boolean;
    get _isSorted(): boolean;
    _sortIconName: 'sorter2-down' | 'sorter2-up' | 'sorter-double';
    ariaLabel: string;
    get id(): string;
    get sortable(): boolean;
    set sortable(value: boolean);
    start: DtSortDirection;
    constructor(_changeDetectorRef: ChangeDetectorRef, _dtColumnDef: DtColumnDef, _sort: DtSort);
    _getAriaSortAttribute(): string | null;
    _handleClick(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
}

export declare class DtSortHeaderBase {
}

export declare class DtTable<T> extends _DtTableBase<T> implements OnDestroy {
    _dataAccessors: BehaviorSubject<SimpleColumnsAccessorMaps<T>>;
    _emptyState: QueryList<DtEmptyState>;
    _emptyStateTemplate: TemplateRef<DtEmptyState>;
    _portalOutlet: CdkPortalOutlet;
    _uniqueId: string;
    get isEmptyDataSource(): boolean;
    get loading(): boolean;
    set loading(value: boolean);
    get multiExpand(): boolean;
    set multiExpand(value: boolean);
    protected stickyCssClass: string;
    constructor(differs: IterableDiffers, changeDetectorRef: ChangeDetectorRef, elementRef: ElementRef, role: string, document: any, platform: Platform, _viewContainerRef: ViewContainerRef);
    _removeColumnAccessors(name: string): void;
    _updateColumnAccessors(name: string, displayAccessor?: DtSimpleColumnDisplayAccessorFunction<T>, sortAccessor?: DtSimpleColumnSortAccessorFunction<T>, comparatorFunction?: DtSimpleColumnComparatorFunction<T>): void;
    ngOnDestroy(): void;
    renderRows(): void;
}

export declare type DtTableColumnAlign = 'left' | 'right' | 'center';

export declare type DtTableColumnTypedAlign = 'text' | 'id' | 'icon' | 'control' | 'number' | 'date' | 'ip';

export declare class DtTableDataSource<T> extends DataSource<T> {
    _customSortAccessorMap: Map<string, DtSortAccessorFunction<T>>;
    _displayAccessorMap: Map<string, DtSimpleColumnDisplayAccessorFunction<T>>;
    _simpleColumnSortAccessorMap: Map<string, DtSimpleColumnSortAccessorFunction<T>>;
    get data(): T[];
    set data(data: T[]);
    get filter(): string;
    set filter(value: string);
    filterPredicate: (data: T, filter: string) => boolean;
    filteredData: T[];
    get pageSize(): number;
    set pageSize(pageSize: number);
    get pagination(): DtPagination | null;
    set pagination(pagination: DtPagination | null);
    renderData: Observable<T[]>;
    get search(): DtTableSearch | null;
    set search(search: DtTableSearch | null);
    get sort(): DtSort | null;
    set sort(sort: DtSort | null);
    sortData: (data: T[], sort: DtSort) => T[];
    sortingDataAccessor: (data: T, sortHeaderId: string) => string | number | null;
    constructor(initialData?: T[]);
    _sortData(data: T[]): T[];
    addComparatorFunction(columnName: string, fn: DtColumnComparatorFunction<T>): void;
    addSortAccessorFunction(columnName: string, fn: DtSortAccessorFunction<T>): void;
    connect(_table: DtTable<T>): Observable<T[]>;
    disconnect(): void;
    removeComparatorFunction(columnName: string): void;
    removeSortAccessorFunction(columnName: string): void;
}

export declare class DtTableLoadingState {
}

export declare class DtTableModule {
}

export declare class DtTableOrderDataSource<T> extends DataSource<T> {
    get data(): T[];
    set data(data: T[]);
    get order(): DtOrder<T> | null;
    set order(order: DtOrder<T> | null);
    constructor(initialData?: T[]);
    _orderData(data: T[], orderChange: DtOrderChangeEvent | undefined): T[];
    connect(_table: DtTable<T>): Observable<T[]>;
    disconnect(): void;
}

export declare class DtTableSearch implements ControlValueAccessor {
    ariaLabel: string;
    ariaLabelledBy: string;
    placeholder: string;
    get value(): string;
    set value(value: string);
    readonly valueChange: EventEmitter<DtTableSearchChangeEvent>;
    _handleBlur(): void;
    _handleInputChange(event: Event): void;
    registerOnChange(fn: (value: string) => void): void;
    registerOnTouched(fn?: () => void): void;
    writeValue(value: string): void;
}

export interface DtTableSearchChangeEvent {
    readonly source: DtTableSearch;
    readonly value: string;
}

export declare function getDtSortHeaderNotContainedWithinSortError(): Error;

export declare function getDtSortInvalidDirectionError(direction: string): Error;

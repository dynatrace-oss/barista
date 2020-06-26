export declare class DtTreeTable<T> extends _DtTableBase<T> {
    treeControl: DtTreeControl<T>;
    constructor(differs: IterableDiffers, changeDetectorRef: ChangeDetectorRef, elementRef: ElementRef, document: any, platform: Platform, role: string);
}

export declare class DtTreeTableHeaderCell {
    constructor(_columnDef: DtColumnDef, _elementRef: ElementRef);
}

export declare class DtTreeTableModule {
}

export declare class DtTreeTableRow<T> extends DtRow {
    get _isExpanded(): boolean;
    get _level(): number;
    get data(): T;
    set data(data: T);
    constructor(elementRef: ElementRef, _treeTable: DtTreeTable<T>);
}

export declare class DtTreeTableToggleCell<T> extends DtCell implements OnDestroy, AfterViewInit {
    _changeDetectorRef: ChangeDetectorRef;
    _columnDef: DtColumnDef;
    get _expandable(): boolean;
    get _isExpanded(): boolean;
    get _rowData(): T;
    get _treeControl(): DtTreeControl<T>;
    _wrapperElement: ElementRef;
    ariaLabel: string;
    ariaLabelledBy: string;
    readonly collapsed: Observable<boolean>;
    readonly expandChange: Observable<boolean>;
    get expanded(): boolean;
    set expanded(value: boolean);
    readonly treeExpanded: Observable<boolean>;
    constructor(_columnDef: DtColumnDef, _changeDetectorRef: ChangeDetectorRef, elementRef: ElementRef, _treeTable: DtTreeTable<T>);
    _collapse(): void;
    _expand(): void;
    _toggle(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}

export declare class DtKeyValueList implements AfterContentInit, OnDestroy {
    _calculatedColumns: number;
    _items: QueryList<DtKeyValueListItem>;
    get columns(): number;
    set columns(newValue: number);
    constructor(_changeDetectorRef: ChangeDetectorRef);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare class DtKeyValueListItem {
}

export declare class DtKeyValueListKey {
}

export declare class DtKeyValueListModule {
}

export declare class DtKeyValueListValue {
}

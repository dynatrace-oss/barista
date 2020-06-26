export declare class DtSecondaryNav implements AfterViewInit, OnDestroy {
    get multi(): boolean;
    set multi(value: boolean);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}

export declare class DtSecondaryNavGroup {
    label: string;
}

export declare class DtSecondaryNavModule {
}

export declare class DtSecondaryNavSection implements AfterContentInit, OnDestroy {
    _active: boolean;
    readonly _sectionCollapse: Observable<boolean>;
    readonly _sectionExpand: Observable<boolean>;
    _sectionExpandChange$: Subject<DtSecondaryNavSection>;
    readonly expandChange: EventEmitter<boolean>;
    get expanded(): boolean;
    set expanded(value: boolean);
    constructor(_changeDetectorRef: ChangeDetectorRef);
    _activateAndExpandSection(): void;
    _checkForActiveStates(): void;
    _sectionExpanded(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare class DtSecondaryNavSectionDescription {
}

export declare class DtSecondaryNavSectionTitle {
}

export declare class DtSecondaryNavTitle {
}

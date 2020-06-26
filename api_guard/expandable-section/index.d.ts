export declare const _ExpandableSectionBase: import("../../core/dynatrace-barista-components-core").Constructor<HasId> & typeof DtExpandableSectionBase;

export declare class DtExpandableSection extends _ExpandableSectionBase implements CanDisable, HasId, OnChanges {
    readonly _sectionCollapsed: import("rxjs").Observable<boolean>;
    readonly _sectionExpanded: import("rxjs").Observable<boolean>;
    get disabled(): boolean;
    set disabled(value: boolean);
    readonly expandChange: EventEmitter<boolean>;
    get expanded(): boolean;
    set expanded(value: boolean);
    constructor(_changeDetectorRef: ChangeDetectorRef);
    close(): void;
    ngOnChanges(changes: SimpleChanges): void;
    open(): void;
    toggle(): void;
}

export declare class DtExpandableSectionBase {
    constructor();
}

export declare class DtExpandableSectionHeader {
}

export declare class DtExpandableSectionModule {
}

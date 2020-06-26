export declare const _ExpandableTextBase: import("../../core/dynatrace-barista-components-core").Constructor<HasId> & typeof DtExpandableTextBase;

export declare class DtExpandableText extends _ExpandableTextBase implements HasId {
    readonly _textCollapsed: Observable<boolean>;
    readonly _textExpanded: Observable<boolean>;
    readonly expandChanged: EventEmitter<boolean>;
    get expanded(): boolean;
    set expanded(value: boolean);
    label: string;
    labelClose: string;
    constructor(_changeDetectorRef: ChangeDetectorRef);
    close(): void;
    open(): void;
    toggle(): void;
}

export declare class DtExpandableTextBase {
    constructor();
}

export declare class DtExpandableTextModule {
}

export declare class DtExpandablePanel {
    _id: BehaviorSubject<string>;
    readonly _panelCollapsed: Observable<boolean>;
    readonly _panelExpanded: Observable<boolean>;
    get disabled(): boolean;
    set disabled(value: boolean);
    readonly expandChange: EventEmitter<boolean>;
    get expanded(): boolean;
    set expanded(value: boolean);
    get id(): string;
    set id(value: string);
    constructor(_changeDetectorRef: ChangeDetectorRef);
    close(): void;
    open(): void;
    toggle(): void;
}

export declare class DtExpandablePanelModule {
}

export declare class DtExpandablePanelTrigger implements OnDestroy {
    get dtExpandablePanel(): DtExpandablePanel;
    set dtExpandablePanel(value: DtExpandablePanel);
    constructor(_changeDetectorRef: ChangeDetectorRef);
    _handleClick(): void;
    _handleKeydown(event: KeyboardEvent): void;
    ngOnDestroy(): void;
}

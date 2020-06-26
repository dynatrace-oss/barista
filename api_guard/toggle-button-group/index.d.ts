export declare const _DtToggleButtonMixinBase: import("../../core/dynatrace-barista-components-core").Constructor<HasTabIndex> & import("../../core/dynatrace-barista-components-core").Constructor<CanDisable> & typeof DtToggleButtonBase;

export declare class DtToggleButtonBase {
}

export interface DtToggleButtonChange<T> {
    isUserInput: boolean;
    source: DtToggleButtonItem<T>;
    value: T | null;
}

export declare class DtToggleButtonGroup<T> implements AfterContentInit, OnDestroy {
    readonly _itemSelectionChanges: Observable<DtToggleButtonChange<T>>;
    _toggleButtonItems: QueryList<DtToggleButtonItem<T>>;
    readonly change: Observable<DtToggleButtonChange<T>>;
    get selectedItem(): DtToggleButtonItem<T> | null;
    get value(): T | null;
    constructor(_ngZone: NgZone, _changeDetectorRef: ChangeDetectorRef);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare class DtToggleButtonGroupModule {
}

export declare class DtToggleButtonItem<T> extends _DtToggleButtonMixinBase implements CanDisable, HasTabIndex {
    ariaDescribedby: string;
    ariaLabel: string;
    ariaLabelledby: string;
    readonly change: EventEmitter<DtToggleButtonChange<T>>;
    get selected(): boolean;
    set selected(value: boolean);
    get value(): T;
    set value(value: T);
    constructor(_elementRef: ElementRef, _changeDetectorRef: ChangeDetectorRef, _focusMonitor: FocusMonitor);
    _deselectViaInteraction(): void;
    _handleClick(): void;
    _selectViaInteraction(): void;
    deselect(): void;
    focus(): void;
    select(): void;
}

export declare class DtToggleButtonItemIcon {
}

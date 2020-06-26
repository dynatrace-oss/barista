export declare const _DtButtonGroup: Constructor<HasTabIndex> & typeof DtButtonGroupBase;

export declare const _DtButtonGroupItem: Constructor<HasTabIndex> & Constructor<CanColor<DtButtonGroupThemePalette>> & Constructor<DtButtonGroupItemBase>;

export declare class DtButtonGroup<T> extends _DtButtonGroup implements CanDisable, HasTabIndex, AfterContentInit {
    get disabled(): boolean;
    set disabled(value: boolean);
    get value(): T | null;
    set value(newValue: T | null);
    readonly valueChange: EventEmitter<T | null>;
    constructor(_changeDetectorRef: ChangeDetectorRef);
    _emitChangeEvent(): void;
    focus(): void;
    ngAfterContentInit(): void;
}

export declare class DtButtonGroupBase {
    disabled: boolean;
}

export declare class DtButtonGroupItem<T> extends _DtButtonGroupItem implements CanDisable, CanColor<DtButtonGroupThemePalette>, HasTabIndex, AfterContentInit, OnDestroy {
    get disabled(): boolean;
    set disabled(value: boolean);
    get selected(): boolean;
    set selected(value: boolean);
    readonly selectionChange: EventEmitter<DtButtonGroupItemSelectionChange<T>>;
    get value(): T;
    set value(newValue: T);
    constructor(_buttonGroup: DtButtonGroup<T>, _changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef, _focusMonitor: FocusMonitor);
    _handleKeydown(event: KeyboardEvent): void;
    _markForCheck(): void;
    _onSelect(event: Event): void;
    focus(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare class DtButtonGroupItemBase {
    _elementRef: ElementRef;
    disabled: boolean;
    constructor(_elementRef: ElementRef);
}

export interface DtButtonGroupItemSelectionChange<T> {
    source: DtButtonGroupItem<T>;
    value: T | null;
}

export declare class DtButtonGroupModule {
}

export declare type DtButtonGroupThemePalette = 'main' | 'error';

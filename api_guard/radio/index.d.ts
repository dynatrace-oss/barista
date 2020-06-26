export declare const _DtRadioButtonMixinBase: import("../../core/dynatrace-barista-components-core").Constructor<HasTabIndex> & typeof DtRadioButtonBase;

export declare class DtRadioButton<T> extends _DtRadioButtonMixinBase implements OnInit, AfterViewInit, OnDestroy, CanDisable, HasTabIndex {
    _focused: boolean;
    _inputElement: ElementRef;
    get _inputId(): string;
    ariaDescribedby: string;
    ariaLabel: string;
    ariaLabelledby: string;
    readonly change: EventEmitter<DtRadioChange<T>>;
    get checked(): boolean;
    set checked(value: boolean);
    get disabled(): boolean;
    set disabled(value: boolean);
    id: string;
    name: string;
    get required(): boolean;
    set required(value: boolean);
    get value(): T;
    set value(value: T);
    constructor(_elementRef: ElementRef, _changeDetector: ChangeDetectorRef, _radioDispatcher: UniqueSelectionDispatcher, _focusMonitor: FocusMonitor, _radioGroup: DtRadioGroup<T>);
    _focusChanged(isFocused: boolean): void;
    _markForCheck(): void;
    _onInputChange(event: Event): void;
    _onInputClick(event: Event): void;
    focus(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
}

export declare class DtRadioButtonBase {
    disabled: boolean;
}

export interface DtRadioChange<T> {
    source: DtRadioButton<T>;
    value: T | null;
}

export declare class DtRadioGroup<T> implements AfterContentInit, CanDisable, ControlValueAccessor, DtFormFieldControl<T> {
    _ariaDescribedby: string;
    _boxControl: boolean;
    _controlValueAccessorChangeFn: (value: T) => void;
    _onTouched: () => void;
    _radios: QueryList<DtRadioButton<T>>;
    readonly change: EventEmitter<DtRadioChange<T>>;
    get disabled(): boolean;
    set disabled(value: boolean);
    empty: boolean;
    errorState: boolean;
    focused: boolean;
    get id(): string;
    set id(value: string);
    get name(): string;
    set name(value: string);
    ngControl: NgControl | null;
    get required(): boolean;
    set required(value: boolean);
    get selected(): DtRadioButton<T> | null;
    set selected(selected: DtRadioButton<T> | null);
    readonly stateChanges: Subject<void>;
    get value(): T | null;
    set value(newValue: T | null);
    constructor(_changeDetector: ChangeDetectorRef, ngControl?: NgControl | null);
    _checkSelectedRadioButton(): void;
    _emitChangeEvent(): void;
    _touch(): void;
    _updateFocused(): void;
    focus(): void;
    ngAfterContentInit(): void;
    onContainerClick(): void;
    registerOnChange(fn: (value: T) => void): void;
    registerOnTouched(fn: () => void): void;
    setDescribedByIds(ids: string[]): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(value: T): void;
}

export declare class DtRadioModule {
}

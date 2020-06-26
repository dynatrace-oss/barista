export declare const _DtCheckboxMixinBase: import("../../core/dynatrace-barista-components-core").Constructor<HasTabIndex> & import("../../core/dynatrace-barista-components-core").Constructor<CanDisable> & typeof DtCheckboxBase;

export declare const DT_CHECKBOX_REQUIRED_VALIDATOR: Provider;

export declare class DtCheckbox<T> extends _DtCheckboxMixinBase implements CanDisable, HasTabIndex, AfterViewInit, OnDestroy, OnInit, OnChanges, ControlValueAccessor, DtFormFieldControl<T> {
    _ariaDescribedby: string;
    _boxControl: boolean;
    _inputElement: ElementRef;
    get _inputId(): string;
    _onTouched: () => void;
    ariaLabel: string;
    ariaLabelledby: string | null;
    readonly change: EventEmitter<DtCheckboxChange<T>>;
    get checked(): boolean;
    set checked(value: boolean);
    get disabled(): boolean;
    set disabled(value: boolean);
    empty: boolean;
    errorState: boolean;
    focused: boolean;
    get id(): string;
    set id(value: string);
    get indeterminate(): boolean;
    set indeterminate(value: boolean);
    readonly indeterminateChange: EventEmitter<boolean>;
    name: string | null;
    ngControl: NgControl | null;
    get required(): boolean;
    set required(value: boolean);
    readonly stateChanges: Subject<void>;
    value: T;
    constructor(_changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef, _focusMonitor: FocusMonitor, _platform: Platform, tabIndex: string, ngControl?: NgControl | null);
    _focusChanged(isFocused: boolean): void;
    _getAriaChecked(): 'true' | 'false' | 'mixed';
    _onInputChange(event: Event): void;
    _onInputClick(event: Event): void;
    focus(): void;
    ngAfterViewInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    onContainerClick(): void;
    registerOnChange(fn: (value: boolean) => void): void;
    registerOnTouched(fn?: () => void): void;
    setDescribedByIds(ids: string[]): void;
    setDisabledState(isDisabled: boolean): void;
    toggle(): void;
    writeValue(value: boolean): void;
}

export declare class DtCheckboxBase {
}

export interface DtCheckboxChange<T> {
    checked: boolean;
    source: DtCheckbox<T>;
}

export declare class DtCheckboxModule {
}

export declare class DtCheckboxRequiredValidator extends CheckboxRequiredValidator {
}

export declare const enum TransitionCheckState {
    Init = 0,
    Checked = 1,
    Unchecked = 2,
    Indeterminate = 3
}

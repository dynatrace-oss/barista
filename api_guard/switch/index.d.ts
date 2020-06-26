export declare const _DtSwitchMixinBase: import("../../core/dynatrace-barista-components-core").Constructor<HasTabIndex> & import("../../core/dynatrace-barista-components-core").Constructor<CanDisable> & typeof DtSwitchBase;

export declare const DT_SWITCH_REQUIRED_VALIDATOR: Provider;

export declare class DtSwitch<T> extends _DtSwitchMixinBase implements CanDisable, HasTabIndex, OnDestroy, OnChanges, AfterViewInit, ControlValueAccessor, DtFormFieldControl<T> {
    _ariaDescribedby: string;
    _boxControl: boolean;
    _inputElement: ElementRef;
    _onTouched: () => void;
    ariaLabel: string;
    ariaLabelledby: string | null;
    readonly change: EventEmitter<DtSwitchChange<T>>;
    get checked(): boolean;
    set checked(value: boolean);
    get disabled(): boolean;
    set disabled(value: boolean);
    empty: boolean;
    errorState: boolean;
    focused: boolean;
    get id(): string;
    set id(value: string);
    get inputId(): string;
    name: string | null;
    ngControl: NgControl | null;
    get required(): boolean;
    set required(value: boolean);
    readonly stateChanges: Subject<void>;
    value: T;
    constructor(_changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef, _focusMonitor: FocusMonitor, tabIndex: string, ngControl?: NgControl | null);
    _focusChanged(isFocused: boolean): void;
    _getAriaChecked(): 'true' | 'false';
    _handleInputChange(event: Event): void;
    _handleInputClick(event: Event): void;
    focus(): void;
    ngAfterViewInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    onContainerClick(): void;
    registerOnChange(fn: (value: boolean) => void): void;
    registerOnTouched(fn?: () => void): void;
    setDescribedByIds(ids: string[]): void;
    setDisabledState(isDisabled: boolean): void;
    toggle(): void;
    writeValue(value: boolean): void;
}

export declare class DtSwitchBase {
}

export interface DtSwitchChange<T> {
    checked: boolean;
    source: DtSwitch<T>;
}

export declare class DtSwitchModule {
}

export declare class DtSwitchRequiredValidator extends CheckboxRequiredValidator {
}

export declare const _DtInputMixinBase: import("../../core/dynatrace-barista-components-core").Constructor<CanUpdateErrorState> & typeof DtInputBase;

export declare class DtInput extends _DtInputMixinBase implements DoCheck, OnInit, OnChanges, OnDestroy, CanUpdateErrorState, DtFormFieldControl<string> {
    _ariaDescribedby: string;
    protected _neverEmptyInputTypes: string[];
    autofilled: boolean;
    get disabled(): boolean;
    set disabled(value: boolean);
    get empty(): boolean;
    errorStateMatcher: ErrorStateMatcher;
    focused: boolean;
    get id(): string;
    set id(value: string);
    ngControl: NgControl;
    placeholder: string;
    get readonly(): boolean;
    set readonly(value: boolean);
    get required(): boolean;
    set required(value: boolean);
    readonly stateChanges: Subject<void>;
    get type(): string;
    set type(value: string);
    get value(): string;
    set value(value: string);
    constructor(_elementRef: ElementRef, _platform: Platform, ngControl: NgControl, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, _defaultErrorStateMatcher: ErrorStateMatcher, _autofillMonitor: AutofillMonitor);
    _focusChanged(isFocused: boolean): void;
    protected _isBadInput(): boolean;
    protected _isNeverEmpty(): boolean;
    _onInput(): void;
    focus(): void;
    ngDoCheck(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    onContainerClick(): void;
    setDescribedByIds(ids: string[]): void;
}

export declare class DtInputBase {
    _defaultErrorStateMatcher: ErrorStateMatcher;
    _parentForm: NgForm;
    _parentFormGroup: FormGroupDirective;
    ngControl: NgControl;
    constructor(_defaultErrorStateMatcher: ErrorStateMatcher, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, ngControl: NgControl);
}

export declare class DtInputModule {
}

export declare const _DtSelectMixinBase: import("../../core/dynatrace-barista-components-core").Constructor<HasTabIndex> & import("../../core/dynatrace-barista-components-core").Constructor<CanDisable> & import("../../core/dynatrace-barista-components-core").Constructor<CanUpdateErrorState> & typeof DtSelectBase;

export declare class DtSelect<T> extends _DtSelectMixinBase implements OnInit, AfterContentInit, OnChanges, OnDestroy, DoCheck, ControlValueAccessor, CanDisable, HasTabIndex, DtFormFieldControl<T>, CanUpdateErrorState {
    _ariaDescribedby: string;
    _keyManager: ActiveDescendantKeyManager<DtOption<T>>;
    _onChange: (value: T) => void;
    _onTouched: () => void;
    _optionIds: string;
    _panelDoneAnimating: boolean;
    _panelDoneAnimatingStream: Subject<string>;
    _positions: ({
        originX: string;
        originY: string;
        overlayX: string;
        overlayY: string;
        offsetX?: undefined;
    } | {
        originX: string;
        originY: string;
        overlayX: string;
        overlayY: string;
        offsetX: number;
    })[];
    _selectionModel: SelectionModel<DtOption<T>>;
    _triggerRect: ClientRect;
    ariaLabel: string;
    ariaLabelledby: string;
    get compareWith(): (v1: T, v2: T) => boolean;
    set compareWith(fn: (v1: T, v2: T) => boolean);
    get empty(): boolean;
    errorStateMatcher: ErrorStateMatcher;
    get focused(): boolean;
    get id(): string;
    set id(value: string);
    ngControl: NgControl;
    readonly openedChange: EventEmitter<boolean>;
    optionGroups: QueryList<DtOptgroup>;
    readonly optionSelectionChanges: Observable<DtOptionSelectionChange<T>>;
    options: QueryList<DtOption<T>>;
    overlayDir: CdkConnectedOverlay;
    panel: ElementRef;
    panelClass: string | string[] | Set<string> | {
        [key: string]: any;
    };
    get panelOpen(): boolean;
    get placeholder(): string;
    set placeholder(value: string);
    get required(): boolean;
    set required(value: boolean);
    get selected(): DtOption<T>;
    readonly selectionChange: EventEmitter<DtSelectChange<T>>;
    trigger: ElementRef;
    get triggerValue(): string;
    get value(): T;
    set value(newValue: T);
    readonly valueChange: EventEmitter<T>;
    constructor(_changeDetectorRef: ChangeDetectorRef, _ngZone: NgZone, _defaultErrorStateMatcher: ErrorStateMatcher, elementRef: ElementRef, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, _parentFormField: DtFormField<T>, ngControl: NgControl, tabIndex: string, _focusMonitor: FocusMonitor, _config?: DtUiTestConfiguration | undefined);
    _getAriaActiveDescendant(): string | null;
    _getAriaLabel(): string | null;
    _getAriaLabelledby(): string | null;
    _handleKeydown(event: KeyboardEvent): void;
    _onAttached(): void;
    _onBlur(): void;
    _onFadeInDone(): void;
    _onFocus(): void;
    close(): void;
    focus(): void;
    ngAfterContentInit(): void;
    ngDoCheck(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    onContainerClick(): void;
    open(): void;
    registerOnChange(fn: (value: T) => void): void;
    registerOnTouched(fn: () => {}): void;
    setDescribedByIds(ids: string[]): void;
    setDisabledState(isDisabled: boolean): void;
    toggle(): void;
    writeValue(value: T): void;
}

export declare class DtSelectBase {
    _defaultErrorStateMatcher: ErrorStateMatcher;
    _elementRef: ElementRef;
    _parentForm: NgForm;
    _parentFormGroup: FormGroupDirective;
    ngControl: NgControl;
    constructor(_elementRef: ElementRef, _defaultErrorStateMatcher: ErrorStateMatcher, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, ngControl: NgControl);
}

export declare class DtSelectChange<T> {
    source: DtSelect<T>;
    value: T;
    constructor(
    source: DtSelect<T>,
    value: T);
}

export declare class DtSelectModule {
}

export declare const getDtSelectNonFunctionValueError: () => Error;

export declare const SELECT_ITEM_HEIGHT = 28;

export declare const SELECT_PANEL_MAX_HEIGHT = 256;

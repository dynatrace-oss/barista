export declare const _DtInlineEditorMixinBase: import("../../core/dynatrace-barista-components-core").Constructor<CanUpdateErrorState> & typeof DtInlineEditorBase;

export declare class DtInlineEditor extends _DtInlineEditorMixinBase implements ControlValueAccessor, OnDestroy, DoCheck, AfterContentInit, AfterViewInit, CanUpdateErrorState {
    _ariaLabelCancel: string;
    _ariaLabelSave: string;
    _editButtonReference: ElementRef;
    _errorAnimationState: '' | 'enter' | 'enter-delayed';
    _errorChildren: QueryList<DtError>;
    _input: QueryList<DtInput>;
    _inputFocused: boolean;
    get ariaLabelCancel(): string;
    set ariaLabelCancel(value: string);
    get ariaLabelSave(): string;
    set ariaLabelSave(value: string);
    readonly cancelled: EventEmitter<string>;
    get editing(): boolean;
    errorStateMatcher: ErrorStateMatcher;
    get idle(): boolean;
    ngControl: NgControl;
    onRemoteSave: (value: string) => Observable<void>;
    get required(): boolean;
    set required(value: boolean);
    readonly saved: EventEmitter<string>;
    get saving(): boolean;
    get value(): string;
    set value(value: string);
    constructor(_changeDetectorRef: ChangeDetectorRef, _ngZone: NgZone, defaultErrorStateMatcher: ErrorStateMatcher, ngControl: NgControl, parentForm: NgForm, parentFormGroup: FormGroupDirective);
    _getDisplayedError(): boolean;
    _onInput(event: Event): void;
    _onKeyDown(event: KeyboardEvent): void;
    cancelAndQuitEditing(): void;
    enterEditing(): void;
    focus(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    registerOnChange(fn: (value: string) => void): void;
    registerOnTouched(fn: () => void): void;
    saveAndQuitEditing(): void;
    writeValue(value: string): void;
}

export declare class DtInlineEditorBase {
    _defaultErrorStateMatcher: ErrorStateMatcher;
    _parentForm: NgForm;
    _parentFormGroup: FormGroupDirective;
    ngControl: NgControl;
    constructor(_defaultErrorStateMatcher: ErrorStateMatcher, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, ngControl: NgControl);
}

export declare class DtInlineEditorModule {
}

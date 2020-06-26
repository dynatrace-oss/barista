export declare class DtError {
    id: string;
    get message(): string;
    constructor(_elementRef: ElementRef);
}

export declare class DtFormField<T> implements AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy {
    _control: DtFormFieldControl<T>;
    _elementRef: ElementRef;
    _errorAnimationState: '' | 'enter' | 'enter-delayed';
    _errorChildren: QueryList<DtError>;
    _hintChildren: QueryList<DtHint>;
    _labelChild: DtLabel;
    _labelId: string;
    _prefixChildren: QueryList<DtPrefix>;
    _suffixChildren: QueryList<DtSuffix>;
    constructor(_changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef);
    _getDisplayedError(): boolean;
    _shouldForward(prop: string): boolean;
    getConnectedOverlayOrigin(): ElementRef;
    ngAfterContentChecked(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}

export declare abstract class DtFormFieldControl<T> {
    readonly _boxControl?: boolean;
    readonly autofilled?: boolean;
    readonly disabled: boolean;
    readonly empty: boolean;
    readonly errorState: boolean;
    readonly focused: boolean;
    readonly id: string;
    readonly ngControl: NgControl | null;
    readonly required: boolean;
    readonly stateChanges: Observable<void>;
    value: T | null;
    abstract onContainerClick(event: MouseEvent): void;
    abstract setDescribedByIds(ids: string[]): void;
}

export declare class DtFormFieldModule {
}

export declare class DtHint {
    align: 'start' | 'end';
    id: string;
}

export declare class DtLabel {
}

export declare class DtPrefix {
}

export declare class DtSuffix {
}

export declare function getDtFormFieldDuplicatedHintError(align: string): Error;

export declare function getDtFormFieldMissingControlError(): Error;

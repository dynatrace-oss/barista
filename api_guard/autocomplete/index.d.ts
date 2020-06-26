export declare const AUTOCOMPLETE_OPTION_HEIGHT = 28;

export declare const AUTOCOMPLETE_PANEL_MAX_HEIGHT = 256;

export declare const DT_AUTOCOMPLETE_DEFAULT_OPTIONS: InjectionToken<DtAutocompleteDefaultOptions>;

export declare function DT_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY(): DtAutocompleteDefaultOptions;

export declare const DT_AUTOCOMPLETE_VALUE_ACCESSOR: Provider;

export declare class DtAutocomplete<T> implements AfterContentInit, AfterViewInit, OnDestroy {
    get _additionalOptions(): DtOption<T>[];
    set _additionalOptions(val: DtOption<T>[]);
    _additionalPortal: TemplatePortal;
    _classList: {
        [key: string]: boolean;
    };
    _isOpen: boolean;
    _keyManager: ActiveDescendantKeyManager<DtOption<T>>;
    _options: QueryList<DtOption<T>>;
    _panel: ElementRef;
    _portal: TemplatePortal;
    _template: TemplateRef<any>;
    get autoActiveFirstOption(): boolean;
    set autoActiveFirstOption(value: boolean);
    set classList(value: string);
    readonly closed: EventEmitter<void>;
    displayWith: ((value: T) => string) | null;
    id: string;
    get isOpen(): boolean;
    readonly opened: EventEmitter<void>;
    readonly optionSelected: EventEmitter<DtAutocompleteSelectedEvent<T>>;
    panelWidth: string | number;
    showPanel: boolean;
    constructor(_changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef<HTMLElement>, _viewContainerRef: ViewContainerRef, defaults: DtAutocompleteDefaultOptions);
    _emitSelectEvent(option: DtOption<T>): void;
    _getScrollTop(): number;
    _setScrollTop(scrollTop: number): void;
    _setVisibility(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}

export interface DtAutocompleteDefaultOptions {
    autoActiveFirstOption?: boolean;
}

export declare class DtAutocompleteModule {
}

export declare class DtAutocompleteOrigin {
    elementRef: ElementRef<HTMLElement>;
    constructor(elementRef: ElementRef<HTMLElement>);
}

export declare class DtAutocompleteSelectedEvent<T> {
    option: DtOption<T>;
    source: DtAutocomplete<T>;
    constructor(
    source: DtAutocomplete<T>,
    option: DtOption<T>);
}

export declare class DtAutocompleteTrigger<T> implements ControlValueAccessor, OnDestroy {
    get activeOption(): DtOption<T> | null;
    get autocomplete(): DtAutocomplete<T>;
    set autocomplete(value: DtAutocomplete<T>);
    autocompleteAttribute: string;
    get autocompleteDisabled(): boolean;
    set autocompleteDisabled(value: boolean);
    connectedTo: DtAutocompleteOrigin;
    readonly optionSelections: Observable<DtOptionSelectionChange<T>>;
    get panelClosingActions(): Observable<DtOptionSelectionChange<T> | null>;
    get panelOpen(): boolean;
    constructor(_element: ElementRef<HTMLInputElement>, _overlay: Overlay, _changeDetectorRef: ChangeDetectorRef, _viewportResizer: DtViewportResizer, _zone: NgZone, _viewportRuler: ViewportRuler, _platform: Platform, _overlayContainer: OverlayContainer, _formField?: DtFormField<string> | undefined, _document?: any, _config?: DtUiTestConfiguration | undefined);
    _handleBlur(): void;
    _handleFocus(): void;
    _handleInput(event: KeyboardEvent): void;
    _handleKeydown(event: KeyboardEvent): void;
    closePanel(): void;
    ngOnDestroy(): void;
    openPanel(): void;
    registerOnChange(fn: (value: any) => {}): void;
    registerOnTouched(fn: () => {}): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(value: T): void;
}

export declare function getDtAutocompleteMissingPanelError(): Error;

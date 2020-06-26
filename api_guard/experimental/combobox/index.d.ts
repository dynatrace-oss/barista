export declare class DtCombobox<T> extends _DtComboboxMixinBase
  implements
    OnInit,
    AfterContentInit,
    AfterViewInit,
    OnDestroy,
    CanDisable,
    HasTabIndex,
    ControlValueAccessor,
    DtFormFieldControl<T> {
  _autocomplete: DtAutocomplete<T>;
  _autocompleteTrigger: DtAutocompleteTrigger<any>;
  _defaultErrorStateMatcher: ErrorStateMatcher;
  _elementRef: ElementRef;
  _loading: boolean;
  _onChange: (value: any) => void;
  _onTouched: () => void;
  _options: QueryList<DtOption<T>>;
  _panelOpen: boolean;
  _parentForm: NgForm;
  _parentFormGroup: FormGroupDirective;
  _searchInput: ElementRef;
  _selectionModel: SelectionModel<DtOption<T>>;
  _templatePortalContent: TemplateRef<any>;
  ariaLabel: string;
  ariaLabelledBy: string;
  get compareWith(): (v1: T, v2: T) => boolean;
  set compareWith(fn: (v1: T, v2: T) => boolean);
  displayWith: (value: T) => string;
  get empty(): boolean;
  filterChange: EventEmitter<string>;
  focused: boolean;
  id: string;
  get loading(): boolean;
  set loading(value: boolean);
  ngControl: NgControl;
  openedChange: EventEmitter<boolean>;
  readonly optionSelectionChanges: Observable<DtOptionSelectionChange<T>>;
  panelClass: string;
  placeholder: string | undefined;
  required: boolean;
  get selected(): DtOption<T>;
  readonly selectionChange: EventEmitter<DtComboboxChange<T>>;
  get triggerValue(): string;
  get value(): T;
  set value(newValue: T);
  valueChange: EventEmitter<T>;
  constructor(
    _elementRef: ElementRef,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    _parentForm: NgForm,
    _parentFormGroup: FormGroupDirective,
    ngControl: NgControl,
    tabIndex: string,
    _viewContainerRef: ViewContainerRef,
    _changeDetectorRef: ChangeDetectorRef,
    _ngZone: NgZone,
  );
  _closed(): void;
  _opened(): void;
  _optionSelected(event: DtAutocompleteSelectedEvent<T>): void;
  _toggle(event: MouseEvent): void;
  close(): void;
  ngAfterContentInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  ngOnInit(): void;
  onContainerClick(_: MouseEvent): void;
  open(): void;
  registerOnChange(fn: (value: any) => {}): void;
  registerOnTouched(fn: () => {}): void;
  setDescribedByIds(_: string[]): void;
  setDisabledState(isDisabled: boolean): void;
  toggle(): void;
  writeValue(value: T): void;
}

export declare class DtComboboxModule {}

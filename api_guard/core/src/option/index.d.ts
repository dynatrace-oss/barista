export declare function _countGroupLabelsBeforeOption<T>(
  optionIndex: number,
  options: DtOption<T>[],
): number;

export declare const _DtOptgroupMixinBase: import('../common-behaviours').Constructor<
  CanDisable
> &
  typeof DtOptgroupBase;

export declare function _getOptionScrollPosition(
  optionIndex: number,
  optionHeight: number,
  currentScrollPosition: number,
  panelHeight: number,
): number;

export declare class DtOptgroup extends _DtOptgroupMixinBase
  implements CanDisable {
  _labelId: string;
  label: string;
}

export declare class DtOptgroupBase {}

export declare class DtOption<T>
  implements Highlightable, AfterViewChecked, OnDestroy {
  readonly _stateChanges: Subject<void>;
  get active(): boolean;
  get disabled(): boolean;
  set disabled(value: boolean);
  readonly group?: DtOptgroup | undefined;
  get id(): string;
  get selected(): boolean;
  readonly selectionChange: EventEmitter<DtOptionSelectionChange<T>>;
  value: T;
  get viewValue(): string;
  constructor(
    _element: ElementRef,
    _changeDetectorRef: ChangeDetectorRef,
    group?: DtOptgroup | undefined,
  );
  _getHostElement(): HTMLElement;
  _getTabIndex(): string;
  _handleClick(event: MouseEvent): void;
  _handleKeydown(event: KeyboardEvent): void;
  _selectViaInteraction(): void;
  deselect(): void;
  focus(): void;
  getLabel(): string;
  ngAfterViewChecked(): void;
  ngOnDestroy(): void;
  select(): void;
  setActiveStyles(): void;
  setInactiveStyles(): void;
}

export declare class DtOptionModule {}

export declare class DtOptionSelectionChange<T> {
  isUserInput: boolean;
  source: DtOption<T>;
  constructor(source: DtOption<T>, isUserInput?: boolean);
}

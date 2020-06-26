export declare class DtQuickFilter<T = any>
  implements AfterViewInit, OnDestroy {
  readonly _activeFilters$: Observable<any[][]>;
  readonly _autocompleteData$: Observable<
    import('../../../filter-field/dynatrace-barista-components-filter-field').DtNodeDef<
      unknown
    >[]
  >;
  _filterField: DtFilterField<T>;
  readonly _filterFieldDataSource$: Observable<
    DtQuickFilterDataSource<any> | undefined
  >;
  ariaLabel: string;
  clearAllLabel: string;
  readonly currentFilterChanges: Observable<
    DtQuickFilterCurrentFilterChangeEvent<T>
  >;
  get dataSource(): DtQuickFilterDataSource;
  set dataSource(dataSource: DtQuickFilterDataSource);
  readonly filterChanges: EventEmitter<DtQuickFilterChangeEvent<T>>;
  get filters(): T[][];
  set filters(filters: T[][]);
  groupHeadlineRole: number;
  readonly inputChange: Observable<string>;
  label: string;
  constructor(_zone: NgZone);
  _changeFilter(action: Action): void;
  _filterFieldChanged(change: DtFilterFieldChangeEvent<T>): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
}

export declare class DtQuickFilterChangeEvent<
  T
> extends DtFilterFieldChangeEvent<T> {}

export declare class DtQuickFilterCurrentFilterChangeEvent<
  T
> extends DtFilterFieldCurrentFilterChangeEvent<T> {}

export declare abstract class DtQuickFilterDataSource<T = any>
  implements DtFilterFieldDataSource<T> {
  abstract showInSidebarFunction: (_node: any) => boolean;
  abstract connect(): Observable<DtNodeDef<T> | null>;
  abstract disconnect(): void;
  abstract isAutocomplete(data: T): boolean;
  abstract isFreeText(data: T): boolean;
  abstract isGroup(data: T): boolean;
  abstract isOption(data: T): boolean;
  abstract isRange(data: T): boolean;
  abstract transformAutocomplete(
    data: T,
    parent: DtNodeDef | null,
    existingDef: DtNodeDef | null,
  ): DtNodeDef<T>;
  abstract transformFreeText(
    data: T,
    parent: DtNodeDef | null,
    existingDef: DtNodeDef | null,
  ): DtNodeDef<T>;
  abstract transformGroup(
    data: T,
    parentAutocomplete: DtNodeDef | null,
    existingDef: DtNodeDef | null,
  ): DtNodeDef<T>;
  abstract transformList(list: T[], parent: DtNodeDef | null): DtNodeDef<T>[];
  abstract transformObject(
    data: T | null,
    parent: DtNodeDef | null,
  ): DtNodeDef<T> | null;
  abstract transformOption(
    data: T,
    parentAutocompleteOrOption: DtNodeDef | null,
    existingDef: DtNodeDef | null,
  ): DtNodeDef<T>;
  abstract transformRange(
    data: T,
    parent: DtNodeDef | null,
    existingDef: DtNodeDef | null,
  ): DtNodeDef<T>;
}

export declare class DtQuickFilterDefaultDataSource<
  T extends DtQuickFilterDefaultDataSourceType
> implements DtQuickFilterDataSource {
  get data(): T;
  set data(data: T);
  showInSidebarFunction: (node: any) => boolean;
  constructor(
    initialData: T | undefined,
    config: DtQuickFilterDefaultDataSourceConfig,
  );
  connect(): Observable<DtNodeDef | null>;
  disconnect(): void;
  isAutocomplete(data: any): data is DtQuickFilterDefaultDataSourceAutocomplete;
  isFreeText(data: any): data is DtQuickFilterDefaultDataSourceFreeText;
  isGroup(data: any): data is DtQuickFilterDefaultDataSourceGroup;
  isOption(data: any): data is DtQuickFilterDefaultDataSourceOption;
  isRange(data: any): data is DtQuickFilterDefaultDataSourceRange;
  transformAutocomplete(
    data: DtQuickFilterDefaultDataSourceAutocomplete,
  ): DtNodeDef;
  transformFreeText(data: DtQuickFilterDefaultDataSourceFreeText): DtNodeDef;
  transformGroup(
    data: DtQuickFilterDefaultDataSourceGroup,
    parentAutocomplete?: DtNodeDef | null,
    existingDef?: DtNodeDef | null,
  ): DtNodeDef;
  transformList(
    list: Array<DtQuickFilterDefaultDataSourceType>,
    parent?: DtNodeDef | null,
  ): DtNodeDef[];
  transformObject(
    data: DtQuickFilterDefaultDataSourceType | null,
    parent?: DtNodeDef | null,
  ): DtNodeDef | null;
  transformOption(
    data: DtQuickFilterDefaultDataSourceOption,
    parentAutocompleteOrOption?: DtNodeDef | null,
    existingDef?: DtNodeDef | null,
  ): DtNodeDef;
  transformRange(data: DtQuickFilterDefaultDataSourceRange): DtNodeDef;
}

export declare type DtQuickFilterDefaultDataSourceAutocomplete = DtFilterFieldDefaultDataSourceAutocomplete;

export interface DtQuickFilterDefaultDataSourceConfig {
  showInSidebar: (node: any) => boolean;
}

export declare type DtQuickFilterDefaultDataSourceFreeText = DtFilterFieldDefaultDataSourceFreeText;

export declare type DtQuickFilterDefaultDataSourceGroup = DtFilterFieldDefaultDataSourceGroup;

export declare type DtQuickFilterDefaultDataSourceOption =
  | DtQuickFilterDefaultDataSourceSimpleOption
  | (DtQuickFilterDefaultDataSourceAutocomplete &
      DtQuickFilterDefaultDataSourceSimpleOption)
  | (DtQuickFilterDefaultDataSourceFreeText &
      DtQuickFilterDefaultDataSourceSimpleOption)
  | (DtQuickFilterDefaultDataSourceRange &
      DtQuickFilterDefaultDataSourceSimpleOption);

export declare type DtQuickFilterDefaultDataSourceRange = DtFilterFieldDefaultDataSourceRange;

export declare type DtQuickFilterDefaultDataSourceSimpleGroup = DtFilterFieldDefaultDataSourceSimpleGroup;

export interface DtQuickFilterDefaultDataSourceSimpleOption {
  name: string;
}

export declare type DtQuickFilterDefaultDataSourceType =
  | DtQuickFilterDefaultDataSourceOption
  | DtQuickFilterDefaultDataSourceGroup
  | DtQuickFilterDefaultDataSourceAutocomplete
  | DtQuickFilterDefaultDataSourceFreeText
  | DtQuickFilterDefaultDataSourceRange;

export declare class DtQuickFilterModule {}

export declare class DtQuickFilterSubTitle {}

export declare class DtQuickFilterTitle {}

export declare class DtDrawerContent {}

export declare class DtDrawerRowDef<T> {
  get _isOpen(): boolean;
  row: T;
  constructor(drawerTable: DtDrawerTable<T>);
  _handleRowClick(): void;
}

export declare class DtDrawerTable<T>
  implements AfterViewInit, AfterContentInit {
  _currentRow: T;
  get isOpen(): boolean;
  get openColumns(): string[];
  set openColumns(openColumns: string[]);
  rowDef: DtRowDef<T>;
  constructor(_changeDetectorRef: ChangeDetectorRef);
  _onRowClicked(row: T): void;
  close(): void;
  ngAfterContentInit(): void;
  ngAfterViewInit(): void;
  open(): void;
  toggle(): void;
}

export declare class DtDrawerTableModule {}

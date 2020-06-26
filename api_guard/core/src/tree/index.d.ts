export declare class DtTreeControl<T> extends FlatTreeControl<T> {}

export declare class DtTreeDataSource<T, F> extends DataSource<F> {
  _data: BehaviorSubject<T[]>;
  _expandedData: BehaviorSubject<F[]>;
  _flattenedData: BehaviorSubject<F[]>;
  get data(): T[];
  set data(value: T[]);
  constructor(
    treeControl: FlatTreeControl<F>,
    treeFlattener: DtTreeFlattener<T, F>,
    initialData?: T[],
  );
  connect(collectionViewer: CollectionViewer): Observable<F[]>;
  disconnect(): void;
}

export declare class DtTreeFlattener<T, F> {
  constructor(
    transformFunction: (node: T, level: number) => F,
    getLevel: (node: F) => number,
    isExpandable: (node: F) => boolean,
    getChildren: (node: T) => Observable<T[]> | T[] | undefined | null,
  );
  expandFlattenedNodes(nodes: F[], treeControl: TreeControl<F>): F[];
  flattenNodes(structuredData: T[]): F[];
}

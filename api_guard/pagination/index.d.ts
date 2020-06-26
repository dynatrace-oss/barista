export declare class DtPagination implements OnInit {
    _ariaLabelCurrent: string;
    _ariaLabelEllipsis: string;
    _ariaLabelNext: string;
    _ariaLabelPage: string;
    _ariaLabelPrevious: string;
    _initialized: AsyncSubject<boolean>;
    _isFirstPage: boolean;
    _isLastPage: boolean;
    _pages: number[][];
    ariaLabel: string;
    get ariaLabelCurrent(): string;
    set ariaLabelCurrent(value: string);
    get ariaLabelEllipsis(): string;
    set ariaLabelEllipsis(value: string);
    get ariaLabelNext(): string;
    set ariaLabelNext(value: string);
    get ariaLabelPage(): string;
    set ariaLabelPage(value: string);
    get ariaLabelPrevious(): string;
    set ariaLabelPrevious(value: string);
    readonly changed: EventEmitter<number>;
    get currentPage(): number;
    set currentPage(value: number);
    get length(): number;
    set length(value: number);
    get numberOfPages(): number;
    get pageSize(): number;
    set pageSize(value: number);
    constructor(_changeDetectorRef: ChangeDetectorRef);
    _setPage(page: number): void;
    next(): void;
    ngOnInit(): void;
    previous(): void;
}

export declare class DtPaginationModule {
}

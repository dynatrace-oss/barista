export declare class DtCustomEmptyState {
}

export declare class DtCustomEmptyStateBase {
    _emptyState: DtEmptyState;
    _updateLayout(): void;
}

export declare class DtEmptyState implements AfterContentInit, AfterViewInit, OnDestroy {
    _isItemLayoutHorizontal: boolean;
    _isLayoutHorizontal: boolean;
    _items: QueryList<DtEmptyStateItem>;
    _visibility: 'visible' | 'hidden';
    set _visible(visibility: boolean);
    constructor(_changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef<HTMLElement>,
    _viewportResizer: DtViewportResizer, _platform: Platform);
    _updateLayout(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}

export declare class DtEmptyStateFooterActions {
}

export declare class DtEmptyStateItem {
}

export declare class DtEmptyStateItemImage {
}

export declare class DtEmptyStateItemTitle {
}

export declare class DtEmptyStateModule {
}

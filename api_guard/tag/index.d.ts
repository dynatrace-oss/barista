export declare class DtTag<T> {
    get removable(): boolean;
    set removable(value: boolean);
    readonly removed: EventEmitter<T>;
    value?: T;
    _removeTag(): void;
}

export declare class DtTagAdd implements AfterViewInit, OnDestroy {
    _inputs: QueryList<ElementRef<HTMLInputElement>>;
    _overlayDir: CdkConnectedOverlay;
    _overlayFocusTrap: CdkTrapFocus;
    _panel: ElementRef;
    _positions: ({
        originX: string;
        originY: string;
        overlayX: string;
        overlayY: string;
        offsetX?: undefined;
    } | {
        originX: string;
        originY: string;
        overlayX: string;
        overlayY: string;
        offsetX: number;
    })[];
    _showOverlay: boolean;
    _tagAddButton: ElementRef<HTMLElement>;
    ariaLabel: string;
    placeholder: string;
    readonly tagAdded: EventEmitter<string>;
    constructor(_changeDetectorRef: ChangeDetectorRef, _zone: NgZone, _elementRef: ElementRef<HTMLElement>, _config?: DtUiTestConfiguration | undefined);
    _addTag(tag: string): void;
    _addTagFromOverlayInput(event: KeyboardEvent): void;
    _onAttached(): void;
    close(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    open(): void;
}

export declare class DtTagKey {
}

export declare class DtTagList implements AfterContentInit, OnDestroy {
    _hiddenTagCount: number;
    _isOneLine: boolean;
    _showAllTags: boolean;
    _tagAddElements: QueryList<DtTagAdd>;
    _tagAddSubscriptions: Subscription[];
    _tagElements: QueryList<ElementRef>;
    _wrapperHeight: number | null;
    _wrapperTagList: ElementRef;
    _wrapperWidth: number | null;
    ariaLabel: string;
    constructor(_viewportResizer: DtViewportResizer, _changeDetectorRef: ChangeDetectorRef, _zone: NgZone, _platform: Platform);
    _expand(): void;
    _handleWrapperProperties(tagArray: ElementRef[], index: number): void;
    _setWrapperBoundingProperties(isCollapsed: boolean): void;
    _toDisplayMoreButton(): boolean;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare class DtTagModule {
}

export declare function getIndexForFirstHiddenTag(tagArray: HTMLElement[]): number;

export declare function getWrapperWidth(lastVisibleTag: HTMLElement, wrapperLeft: number): number;

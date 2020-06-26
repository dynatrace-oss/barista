export declare class DtHighlight implements AfterContentChecked, AfterViewInit, OnChanges, OnDestroy {
    _sourceElement: ElementRef<HTMLElement>;
    _transformedElement: ElementRef<HTMLElement>;
    get caseSensitive(): boolean;
    set caseSensitive(sensitive: boolean);
    term: string;
    constructor(_zone: NgZone, _elementRef: ElementRef, _document?: any);
    ngAfterContentChecked(): void;
    ngAfterViewInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
}

export declare class DtHighlightModule {
}

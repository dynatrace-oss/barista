export declare const _DtBreadcrumbMixinBase: Constructor<import("../../core/dynatrace-barista-components-core").CanColor<DtBreadcrumbThemePalette>> & Constructor<DtBreadcrumbBase>;

export declare class DtBreadcrumbBase {
    _elementRef: ElementRef;
    constructor(_elementRef: ElementRef);
}

export declare class DtBreadcrumbs extends _DtBreadcrumbMixinBase implements AfterContentInit, OnDestroy {
    constructor(elementRef: ElementRef);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare class DtBreadcrumbsItem2 {
    constructor(_elementRef: ElementRef<HTMLAnchorElement>);
    _setCurrent(current: boolean): void;
}

export declare class DtBreadcrumbsModule {
}

export declare type DtBreadcrumbThemePalette = 'main' | 'error' | 'neutral';

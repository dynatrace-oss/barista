export interface DtBreakpointState {
    breakpoints: {
        [key: string]: boolean;
    };
    matches: boolean;
}

export declare class DtContainerBreakpointObserver implements OnDestroy {
    _placeholderContainer: ElementRef<HTMLElement>;
    constructor(_zone: NgZone, _document: any);
    ngOnDestroy(): void;
    observe(value: string | string[]): Observable<DtBreakpointState>;
}

export declare class DtContainerBreakpointObserverModule {
}

export declare class DtIfContainerBreakpoint implements OnDestroy {
    set dtIfContainerBreakpoint(query: string | string[]);
    set dtIfContainerBreakpointElse(templateRef: TemplateRef<DtIfContainerBreakpointContext> | null);
    set dtIfContainerBreakpointThen(templateRef: TemplateRef<DtIfContainerBreakpointContext> | null);
    constructor(_breakpointObserver: DtContainerBreakpointObserver, _viewContainer: ViewContainerRef, _changeDetectorRef: ChangeDetectorRef, templateRef: TemplateRef<DtIfContainerBreakpointContext>);
    ngOnDestroy(): void;
}

export declare class DtIfContainerBreakpointContext {
    $implicit: boolean | null;
    dtIfContainerBreakpoint: boolean | null;
}

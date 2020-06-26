export declare class DtMenu {
}

export declare class DtMenuGroup {
    label: string;
}

export declare class DtMenuItem implements OnDestroy {
    constructor(_focusMonitor: FocusMonitor, _elementRef: ElementRef<HTMLElement>);
    ngOnDestroy(): void;
}

export declare class DtMenuModule {
}

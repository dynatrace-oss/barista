export declare class DtTopBarAction implements OnDestroy {
    get hasProblem(): boolean;
    set hasProblem(active: boolean);
    constructor(_elementRef: ElementRef, _focusMonitor: FocusMonitor);
    ngOnDestroy(): void;
}

export declare class DtTopBarNavigation {
    ariaLabel: string;
}

export declare class DtTopBarNavigationItem {
    align: 'start' | 'end';
}

export declare class DtTopBarNavigationModule {
}

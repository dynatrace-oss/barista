export declare const DT_DRAWER_CONTAINER: InjectionToken<DtDrawerContainer>;

export declare const DT_DRAWER_MODE_BREAKPOINT = 1024;

export declare const DT_DRAWER_OPEN_CLASS = "dt-drawer-is-open";

export declare class DtDrawer implements OnInit, AfterContentChecked, OnDestroy {
    _animationEnd: Subject<AnimationEvent>;
    _animationStarted: Subject<AnimationEvent>;
    _animationState: DtDrawerAnimationState;
    readonly _closedStream: Observable<void>;
    _currentMode: 'side' | 'over';
    readonly _openedStream: Observable<void>;
    readonly _stateChanges: Subject<void>;
    get _width(): number;
    get mode(): 'side' | 'over';
    set mode(value: 'side' | 'over');
    readonly openChange: EventEmitter<boolean>;
    get opened(): boolean;
    set opened(value: boolean);
    get position(): 'start' | 'end';
    set position(value: 'start' | 'end');
    constructor(_elementRef: ElementRef, _breakpointObserver: BreakpointObserver);
    close(): void;
    ngAfterContentChecked(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    open(): void;
    toggle(opened?: boolean): void;
}

export declare const dtDrawerAnimation: AnimationTriggerMetadata[];

export declare type DtDrawerAnimationState = 'open' | 'open-instant' | 'closed';

export declare class DtDrawerContainer implements AfterContentInit, OnDestroy {
    _contentMargins: DtDrawerMargin;
    protected _drawers: QueryList<DtDrawer>;
    get _hasBackdrop(): boolean;
    constructor(_elementRef: ElementRef<HTMLElement>, _changeDetectorRef: ChangeDetectorRef);
    _handleBackdropClick(): void;
    _handleKeyboardEvent(event: KeyboardEvent): void;
    close(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    open(): void;
}

export declare class DtDrawerModule {
}

export declare class DtSidenav extends DtDrawer {
    get fixedInViewport(): boolean;
    set fixedInViewport(value: boolean);
    get fixedTopGap(): number;
    set fixedTopGap(value: number);
}

export declare class DtSidenavContainer extends DtDrawerContainer {
    protected _drawers: QueryList<DtSidenav>;
}

export declare class DtSidenavHeader {
}

export declare function getDtDuplicateDrawerError(position: 'start' | 'end'): Error;

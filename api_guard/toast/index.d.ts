export declare const _DtToastContainerMixin: import("../../core/dynatrace-barista-components-core").Constructor<CanNotifyOnExit> & typeof DtToastContainerBase;

export declare const DT_TOAST_BOTTOM_SPACING = 24;

export declare const DT_TOAST_CHAR_LIMIT = 120;

export declare const DT_TOAST_CHAR_READ_TIME = 50;

export declare const DT_TOAST_DEFAULT_CONFIG: OverlayConfig;

export declare const DT_TOAST_FADE_TIME = 150;

export declare const DT_TOAST_MESSAGE: InjectionToken<string>;

export declare const DT_TOAST_MIN_DURATION = 2000;

export declare const DT_TOAST_PERCEIVE_TIME = 500;

export declare class DtToast {
    constructor(_overlay: Overlay, _injector: Injector, _zone: NgZone);
    create(message: string): DtToastRef | null;
    dismiss(): void;
}

export declare class DtToastContainer extends _DtToastContainerMixin implements OnDestroy, CanNotifyOnExit {
    _animationState: string;
    _elementRef: ElementRef;
    _ngZone: NgZone;
    readonly _onEnter: Subject<void>;
    message: string;
    constructor(message: string, _ngZone: NgZone, _elementRef: ElementRef, _changeDetectorRef: ChangeDetectorRef);
    _animationDone(event: AnimationEvent): void;
    enter(): void;
    exit(): void;
    ngOnDestroy(): void;
}

export declare class DtToastContainerBase implements HasNgZone {
    _ngZone: NgZone;
    constructor(_ngZone: NgZone);
}

export declare class DtToastModule {
}

export declare class DtToastRef {
    containerInstance: DtToastContainer;
    duration: number;
    constructor(containerInstance: DtToastContainer, duration: number, _overlayRef: OverlayRef, _zone: NgZone);
    _dismissAfterTimeout(): void;
    afterDismissed(): Observable<void>;
    afterOpened(): Observable<void>;
    dismiss(): void;
}

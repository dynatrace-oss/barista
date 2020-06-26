export declare const _DtOverlayContainerMixin: import("../../core/dynatrace-barista-components-core").Constructor<CanNotifyOnExit> & typeof DtOverlayContainerBase;

export declare const _DtOverlayTriggerMixin: import("../../core/dynatrace-barista-components-core").Constructor<HasTabIndex> & import("../../core/dynatrace-barista-components-core").Constructor<CanDisable> & typeof DtOverlayTriggerBase;

export declare const DT_OVERLAY_DEFAULT_OFFSET = 12;

export declare const DT_OVERLAY_DELAY = 100;

export declare const DT_OVERLAY_FADE_TIME = 150;

export declare const DT_OVERLAY_NO_POINTER_CLASS = "dt-no-pointer";

export declare class DtOverlay implements OnDestroy {
    _positionStrategy: FlexibleConnectedPositionStrategy;
    get overlayRef(): DtOverlayRef<any> | null;
    constructor(_injector: Injector, _overlay: Overlay, _viewportRuler: ViewportRuler, _document: any, _platform: Platform, _overlayContainer: OverlayContainer);
    create<T>(origin: DtOverlayOrigin, componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, userConfig?: DtOverlayConfig): DtOverlayRef<T>;
    dismiss(): void;
    ngOnDestroy(): void;
}

export declare class DtOverlayConfig {
    data?: any;
    movementConstraint?: 'xAxis' | 'yAxis';
    originY?: 'edge' | 'center';
    pinnable?: boolean;
}

export declare class DtOverlayContainer extends _DtOverlayContainerMixin implements CanNotifyOnExit {
    _animationState: 'void' | 'enter' | 'exit';
    _ngZone: NgZone;
    _portalOutlet: CdkPortalOutlet;
    constructor(_ngZone: NgZone, _elementRef: ElementRef, _focusTrapFactory: FocusTrapFactory, _viewContainerRef: ViewContainerRef, _document: any);
    _animationDone(event: AnimationEvent): void;
    _trapFocus(): void;
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;
    attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C>;
    exit(): void;
}

export declare class DtOverlayContainerBase extends BasePortalOutlet implements HasNgZone {
    _ngZone: NgZone;
    constructor(_ngZone: NgZone);
    attachComponentPortal<T>(_portal: ComponentPortal<T>): ComponentRef<T>;
    attachTemplatePortal<C>(_portal: TemplatePortal<C>): EmbeddedViewRef<C>;
}

export declare class DtOverlayModule {
}

export declare type DtOverlayOrigin = ElementRef | HTMLElement | {
    x: number;
    y: number;
};

export declare class DtOverlayRef<T> {
    _templatePortal: TemplatePortal | null;
    componentInstance: T | null;
    containerInstance: DtOverlayContainer;
    get disposableFns(): Array<() => void>;
    get pinnable(): boolean;
    get pinned(): boolean;
    constructor(_overlayRef: OverlayRef, containerInstance: DtOverlayContainer, _config: DtOverlayConfig);
    afterExit(): Observable<void>;
    dismiss(): void;
    pin(value: boolean): void;
    updateImplicitContext(data: any): void;
    updatePosition(_offsetX?: number, _offsetY?: number): void;
}

export declare class DtOverlayTrigger<T> extends _DtOverlayTriggerMixin implements CanDisable, HasTabIndex, OnDestroy {
    get dtOverlayConfig(): DtOverlayConfig;
    set dtOverlayConfig(value: DtOverlayConfig);
    get overlay(): TemplateRef<T>;
    set overlay(value: TemplateRef<T>);
    constructor(elementRef: ElementRef<Element>, _dtOverlayService: DtOverlay, _ngZone: NgZone, _focusMonitor: FocusMonitor, tabIndex: string, _platform: Platform);
    _handleClick(): void;
    _handleKeydown(event: KeyboardEvent): void;
    _handleMouseEnter(enterEvent: MouseEvent): void;
    _handleMouseLeave(event: MouseEvent): void;
    _handleMouseMove(event: MouseEvent, enterEvent: MouseEvent): void;
    focus(): void;
    ngOnDestroy(): void;
}

export declare class DtOverlayTriggerBase {
}

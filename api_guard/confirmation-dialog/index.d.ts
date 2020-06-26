export declare const DT_CONFIRMATION_BACKDROP_ACTIVE_OPACITY = "0.6";

export declare const DT_CONFIRMATION_POP_DURATION = 250;

export declare class DtConfirmationDialog implements AfterContentChecked, AfterContentInit, OnDestroy {
    _positionState: 'down' | 'up';
    _wiggleState: boolean;
    ariaLabel: string;
    ariaLabelledBy: string;
    get showBackdrop(): boolean;
    set showBackdrop(value: boolean);
    get state(): string | null;
    set state(value: string | null);
    constructor(_overlay: Overlay, _viewContainerRef: ViewContainerRef, _changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef<HTMLElement>, _viewportResizer: DtViewportResizer, _config?: DtUiTestConfiguration | undefined);
    _popDone(): void;
    focusAttention(): void;
    ngAfterContentChecked(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare class DtConfirmationDialogActions {
}

export declare class DtConfirmationDialogModule {
}

export declare class DtConfirmationDialogState {
    _isActive: boolean;
    name: string;
    constructor(_changeDetectorRef: ChangeDetectorRef);
    _updateActive(value: boolean): void;
}

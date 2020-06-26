export declare function _addCssClass(el: any, name: string): void;

export declare function _countGroupLabelsBeforeOption<T>(optionIndex: number, options: DtOption<T>[]): number;

export declare const _DtColorMixinBase: Constructor<CanColor<DtThemePalette>> & typeof DtColorBase;

export declare const _DtOptgroupMixinBase: import("../common-behaviours").Constructor<CanDisable> & typeof DtOptgroupBase;

export declare function _getElementBoundingClientRect(el: Element | ElementRef): ClientRect & {
    isNativeRect: boolean;
};

export declare function _getOptionScrollPosition(optionIndex: number, optionHeight: number, currentScrollPosition: number, panelHeight: number): number;

export declare function _hasCssClass(el: any, name: string): boolean;

export declare function _isValidColorHexValue(value: string): boolean;

export declare function _parseCssValue(input: any): {
    value: number;
    unit: string;
} | null;

export declare function _readKeyCode(event: KeyboardEvent): number;

export declare function _removeCssClass(el: any, // tslint:disable-line:no-any
name: string): void;

export declare function _replaceCssClass(elOrRef: any, // tslint:disable-line:no-any
oldClass: string | null, newClass: string | null): void;

export declare function _toggleCssClass(condition: boolean, el: any, name: string): void;

export interface CanColor<P extends Partial<DtThemePalette>> {
    color: P;
}

export interface CanDisable {
    disabled: boolean;
}

export interface CanNotifyOnExit {
    readonly _onDomExit: Subject<void>;
    _notifyDomExit(): void;
}

export interface CanUpdateErrorState {
    errorState: boolean;
    errorStateMatcher: ErrorStateMatcher;
    readonly stateChanges: Subject<void>;
    updateErrorState(): void;
}

export declare function clamp(v: number, min?: number, max?: number): number;

export declare function compareNumbers(valueA: number | null, valueB: number | null, direction?: DtSortDirection): number;

export declare function compareStrings(valueA: string | null, valueB: string | null, direction?: DtSortDirection): number;

export declare function compareValues(valueA: string | number | null, valueB: string | number | null, direction: DtSortDirection): number;

export interface ConnectedPosition {
    offsetX?: number;
    offsetY?: number;
    originX: 'start' | 'center' | 'end';
    originY: 'top' | 'center' | 'bottom';
    overlayX: 'start' | 'center' | 'end';
    overlayY: 'top' | 'center' | 'bottom';
    panelClass?: string | string[];
    weight?: number;
}

export declare type Constructor<T> = new (...args: any[]) => T;

export declare function createInViewportStream(element: ElementRef | Element, threshold?: number | number[]): Observable<boolean>;

export declare const DT_COMPARE_WITH_NON_FUNCTION_VALUE_ERROR_MSG = "`compareWith` must be a function.";

export declare const DT_DEFAULT_UI_TEST_CONFIG: DtUiTestConfiguration;

export declare const DT_ERROR_ENTER_ANIMATION: AnimationReferenceMetadata;

export declare const DT_ERROR_ENTER_DELAYED_ANIMATION: AnimationReferenceMetadata;

export declare const DT_LOGGER_NAME: InjectionToken<string>;

export declare const DT_STATIC_LOG_CONSUMER: DtLogConsumer;

export declare const DT_UI_TEST_CONFIG: InjectionToken<DtUiTestConfiguration>;

export declare class DtColor extends _DtColorMixinBase implements CanColor<DtThemePalette> {
    constructor(elementRef: ElementRef);
}

export declare class DtColorBase {
    _elementRef: ElementRef;
    constructor(_elementRef: ElementRef);
}

export declare class DtColorModule {
}

export declare class DtDefaultViewportResizer implements DtViewportResizer {
    get offset$(): Observable<{
        left: number;
        top: number;
    }>;
    constructor(_viewportRuler: ViewportRuler);
    change(): Observable<void>;
    getOffset(): {
        left: number;
        top: number;
    };
}

export declare const dtFadeAnimation: AnimationTriggerMetadata;

export declare class DtFlexibleConnectedPositionStrategy implements PositionStrategy {
    _preferredPositions: ConnectionPositionPair[];
    positionChanges: Observable<ConnectedOverlayPositionChange>;
    get positions(): ConnectionPositionPair[];
    constructor(connectedTo: FlexibleConnectedPositionStrategyOrigin, _viewportRuler: ViewportRuler, _document: Document, _platform: Platform, _overlayContainer: OverlayContainer);
    apply(): void;
    attach(overlayRef: OverlayReference): void;
    detach(): void;
    dispose(): void;
    reapplyLastPosition(): void;
    setOrigin(origin: FlexibleConnectedPositionStrategyOrigin): this;
    withDefaultOffsetX(offset: number): this;
    withDefaultOffsetY(offset: number): this;
    withFlexibleDimensions(flexibleDimensions?: boolean): this;
    withGrowAfterOpen(growAfterOpen?: boolean): this;
    withLockedPosition(isLocked?: boolean): this;
    withPositions(positions: ConnectedPosition[]): this;
    withPush(canPush?: boolean): this;
    withScrollableContainers(scrollables: CdkScrollable[]): this;
    withTransformOriginOn(selector: string): this;
    withViewportBoundaries(boundaries: ViewportBoundaries): this;
    withViewportMargin(margin: number): this;
}

export declare class DtLogConsumer {
    consume(): Observable<DtLogEntry>;
    log(logEntry: DtLogEntry): void;
}

export interface DtLogEntry {
    level: DtLogLevel;
    loggerName: string;
    message: string;
    param?: DtLogEntryParam;
    stack?: string;
}

export declare type DtLogEntryParam = any;

export declare class DtLogger {
    readonly name: string;
    constructor(name: string, _consumer: DtLogConsumer);
    debug(message: string, param?: DtLogEntryParam): void;
    error(message: string, param?: DtLogEntryParam): void;
    info(message: string, param?: DtLogEntryParam): void;
    warn(message: string, param?: DtLogEntryParam): void;
}

export declare class DtLoggerFactory {
    static create(name: string): DtLogger;
}

export declare enum DtLogLevel {
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO",
    DEBUG = "DEBUG"
}

export declare class DtOptgroup extends _DtOptgroupMixinBase implements CanDisable {
    _labelId: string;
    label: string;
}

export declare class DtOptgroupBase {
}

export declare class DtOption<T> implements Highlightable, AfterViewChecked, OnDestroy {
    readonly _stateChanges: Subject<void>;
    get active(): boolean;
    get disabled(): boolean;
    set disabled(value: boolean);
    readonly group?: DtOptgroup | undefined;
    get id(): string;
    get selected(): boolean;
    readonly selectionChange: EventEmitter<DtOptionSelectionChange<T>>;
    value: T;
    get viewValue(): string;
    constructor(_element: ElementRef, _changeDetectorRef: ChangeDetectorRef, group?: DtOptgroup | undefined);
    _getHostElement(): HTMLElement;
    _getTabIndex(): string;
    _handleClick(event: MouseEvent): void;
    _handleKeydown(event: KeyboardEvent): void;
    _selectViaInteraction(): void;
    deselect(): void;
    focus(): void;
    getLabel(): string;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    select(): void;
    setActiveStyles(): void;
    setInactiveStyles(): void;
}

export declare class DtOptionModule {
}

export declare class DtOptionSelectionChange<T> {
    isUserInput: boolean;
    source: DtOption<T>;
    constructor(
    source: DtOption<T>,
    isUserInput?: boolean);
}

export interface DtProgressChange {
    newValue: number;
    oldValue: number;
}

export declare function dtSetUiTestAttribute(overlay: Element, overlayId: string | null, componentElement?: ElementRef | Element, config?: DtUiTestConfiguration): void;

export declare type DtSortDirection = 'asc' | 'desc' | '';

export declare type DtThemePalette = 'main' | 'accent' | 'warning' | 'error' | 'cta' | 'recovered' | 'neutral' | undefined;

export declare class DtTreeControl<T> extends FlatTreeControl<T> {
}

export declare class DtTreeDataSource<T, F> extends DataSource<F> {
    _data: BehaviorSubject<T[]>;
    _expandedData: BehaviorSubject<F[]>;
    _flattenedData: BehaviorSubject<F[]>;
    get data(): T[];
    set data(value: T[]);
    constructor(treeControl: FlatTreeControl<F>, treeFlattener: DtTreeFlattener<T, F>, initialData?: T[]);
    connect(collectionViewer: CollectionViewer): Observable<F[]>;
    disconnect(): void;
}

export declare class DtTreeFlattener<T, F> {
    constructor(transformFunction: (node: T, level: number) => F, getLevel: (node: F) => number, isExpandable: (node: F) => boolean, getChildren: (node: T) => Observable<T[]> | T[] | undefined | null);
    expandFlattenedNodes(nodes: F[], treeControl: TreeControl<F>): F[];
    flattenNodes(structuredData: T[]): F[];
}

export interface DtUiTestConfiguration {
    attributeName: string;
    constructOverlayAttributeValue(uiTestId: string, id: number): string;
}

export declare abstract class DtViewportResizer {
    abstract get offset$(): Observable<{
        left: number;
        top: number;
    }>;
    abstract change(): Observable<void>;
    abstract getOffset(): {
        left: number;
        top: number;
    };
}

export declare class ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean;
}

export declare type FlexibleConnectedPositionStrategyOrigin = ElementRef | HTMLElement | (Point & {
    width?: number;
    height?: number;
});

export interface HasElementRef {
    _elementRef: ElementRef;
}

export interface HasErrorState {
    _defaultErrorStateMatcher: ErrorStateMatcher;
    _parentForm: NgForm;
    _parentFormGroup: FormGroupDirective;
    ngControl: NgControl;
}

export interface HasId {
    id: string;
}

export interface HasNgZone {
    _ngZone: NgZone;
}

export interface HasProgressValues {
    max: number;
    min: number;
    percent: number;
    value: number;
    valueChange: EventEmitter<DtProgressChange>;
    _updateValues(): void;
}

export interface HasTabIndex {
    tabIndex: number;
}

export declare function isDefined<T>(value: T): value is NonNullable<T>;

export declare function isEmpty(value: any): value is null | undefined | '';

export declare function isNumber(value: any): value is number;

export declare function isNumberLike(value: any): boolean;

export declare function isObject(value: any): value is {
    [key: string]: any;
};

export declare function isString(value: any): value is string;

export declare function mixinColor<T extends Constructor<HasElementRef>>(base: T, defaultColor?: DtThemePalette): Constructor<CanColor<DtThemePalette>> & T;
export declare function mixinColor<T extends Constructor<HasElementRef>, P extends Partial<DtThemePalette>>(base: T, defaultColor?: P): Constructor<CanColor<P>> & T;

export declare function mixinDisabled<T extends Constructor<{}>>(base: T): Constructor<CanDisable> & T;

export declare function mixinErrorState<T extends Constructor<HasErrorState>>(base: T): Constructor<CanUpdateErrorState> & T;

export declare function mixinHasProgress<T extends Constructor<{}>>(base: T): Constructor<HasProgressValues> & T;

export declare function mixinId<T extends Constructor<{}>>(base: T, idPreset: string): Constructor<HasId> & T;

export declare function mixinNotifyDomExit<T extends Constructor<HasNgZone>>(base: T): Constructor<CanNotifyOnExit> & T;

export declare function mixinTabIndex<T extends Constructor<CanDisable>>(base: T, defaultTabIndex?: number): Constructor<HasTabIndex> & T;

export declare function roundToDecimal(toRound: number, decimals?: number): number;

export declare function runInsideZone(ngZone: NgZone, scheduler?: SchedulerLike): SchedulerLike;

export declare function runOutsideZone(ngZone: NgZone, scheduler?: SchedulerLike): SchedulerLike;

export declare function sanitizeSvg(svgString: string): SVGElement;

export declare function setComponentColorClasses<T extends {
    color?: string;
} & HasElementRef>(component: T, color?: string): void;

export declare function stringify(token: any): string;

export interface ViewportBoundaries {
    left: number;
    top: number;
}

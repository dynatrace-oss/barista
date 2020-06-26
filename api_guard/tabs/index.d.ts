export declare const _DtTabGroupMixinBase: Constructor<CanDisable> & Constructor<CanColor<DtTabGroupThemePalette>> & Constructor<DtTabGroupBase>;

export declare const _DtTabMixinBase: import("../../../core/dynatrace-barista-components-core").Constructor<HasTabIndex> & import("../../../core/dynatrace-barista-components-core").Constructor<CanDisable> & typeof DtTabBase;

export declare const DT_TABGROUP_NO_ENABLED_TABS_ERROR = "At least one tab must be enabled at all times";

export declare const DT_TABGROUP_SINGLE_TAB_ERROR = "Only one single tab is not allowed inside a tabgroup";

export declare class DtTab extends _DtTabMixinBase implements OnInit, CanDisable, HasTabIndex {
    get _content(): TemplatePortal | null;
    _lazyContentRef: TemplateRef<any>;
    readonly _stateChanges: Subject<void>;
    ariaLabel: string;
    ariaLabelledby: string;
    get color(): TabThemePalette;
    set color(value: TabThemePalette);
    get disabled(): boolean;
    set disabled(value: boolean);
    get id(): string;
    set id(value: string);
    label: DtTabLabel;
    get selected(): boolean;
    set selected(value: boolean);
    constructor(elementRef: ElementRef, _viewContainerRef: ViewContainerRef, _changeDetectorRef: ChangeDetectorRef, _tabGroup: DtTabGroup);
    _deselect(): void;
    _select(viaInteraction: boolean): void;
    ngOnInit(): void;
}

export declare class DtTabBase {
    _elementRef: ElementRef;
    constructor(_elementRef: ElementRef);
}

export declare class DtTabChange {
    isUserInteraction: boolean;
    source: DtTab;
}

export declare class DtTabGroup extends _DtTabGroupMixinBase implements AfterContentInit, OnDestroy, CanColor<DtTabGroupThemePalette>, CanDisable {
    _groupId: string;
    _selected: DtTab | null;
    _tabs: QueryList<DtTab>;
    readonly selectionChanged: EventEmitter<DtTabChange>;
    get tabs(): DtTab[];
    constructor(elementRef: ElementRef, _changeDetectorRef: ChangeDetectorRef);
    _getTabContentId(tabId: string): string;
    _selectTab(): void;
    _tabChange(selected: DtTab, isUserInteraction: boolean): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export declare class DtTabGroupBase {
    _elementRef: ElementRef;
    constructor(_elementRef: ElementRef);
}

export declare class DtTabGroupNavigation implements DtTabGroupNavigationControl, OnDestroy, AfterContentInit {
    constructor(_tabGroup: DtTabGroup, _tabNavigationAdapter: DtTabNavigationAdapter);
    _updateWithTabIds(ids: string[]): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}

export interface DtTabGroupNavigationControl {
    _updateWithTabIds(tabIds: string[]): void;
}

export declare type DtTabGroupThemePalette = 'main' | 'recovered' | 'error';

export declare class DtTabLabel extends CdkPortal {
    constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef);
}

export declare abstract class DtTabNavigationAdapter {
    abstract registerTabControl(control: DtTabGroupNavigationControl): void;
    abstract unregisterTabControl(control: DtTabGroupNavigationControl): void;
    abstract update(id: string, idsToRemove: string[]): void;
}

export declare class DtTabRouterFragmentAdapter extends DtTabNavigationAdapter {
    constructor(_router: Router, _route: ActivatedRoute, _location: Location, _locationStrategy: LocationStrategy);
    registerTabControl(control: DtTabGroupNavigationControl): void;
    unregisterTabControl(control: DtTabGroupNavigationControl): void;
    update(id: string, idsToRemove: string[]): void;
}

export declare class DtTabsModule {
}

export declare type TabThemePalette = 'main' | 'error' | 'recovered' | undefined;

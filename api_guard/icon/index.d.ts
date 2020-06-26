export declare const DT_ICON_CONFIGURATION: InjectionToken<DtIconConfiguration>;

export declare class DtIcon implements OnChanges {
    _elementRef: ElementRef;
    get color(): DtIconColorPalette;
    set color(value: DtIconColorPalette);
    name: DtIconType;
    constructor(_elementRef: ElementRef, _iconRegistry: DtIconRegistry, ariaHidden: string);
    ngOnChanges(changes: SimpleChanges): void;
}

export declare type DtIconColorPalette = 'main' | 'accent' | 'warning' | 'error' | 'cta' | 'recovered' | 'light' | 'dark';

export interface DtIconConfiguration {
    svgIconLocation: string;
}

export declare class DtIconModule {
    static forRoot(config: DtIconConfiguration): ModuleWithProviders<DtIconModule>;
}

export declare class DtIconRegistry {
    constructor(_config: DtIconConfiguration, _httpClient: HttpClient);
    getNamedSvgIcon(name: DtIconType): Observable<SVGElement>;
}

export declare function getDtIconNameNotFoundError(iconName: string): Error;

export declare function getDtIconNoConfigProviderError(): Error;

export declare function getDtIconNoHttpProviderError(): Error;

export declare const _DtHeatfieldMixinBase: Constructor<
  CanColor<DtChartHeatfieldThemePalette>
> &
  Constructor<DtHeatfieldBase>;

export declare class DtChartHeatfield extends _DtHeatfieldMixinBase
  implements CanColor<DtChartHeatfieldThemePalette>, OnDestroy {
  _backdrop: ElementRef;
  _boundingBox: PlotBackgroundInfo;
  get _isValidStartEndRange(): boolean;
  _marker: ElementRef;
  _overlay: CdkConnectedOverlay;
  _overlayAnimationState: 'void' | 'fadeIn';
  _positions: ConnectedPosition[];
  get active(): boolean;
  set active(val: boolean);
  readonly activeChange: EventEmitter<DtChartHeatfieldActiveChange>;
  ariaLabel: string;
  ariaLabelledBy: string;
  get end(): number;
  set end(val: number);
  get start(): number;
  set start(val: number);
  constructor(elementRef: ElementRef, _changeDetectorRef: ChangeDetectorRef);
  _handleKeydown(event: KeyboardEvent): void;
  _initHeatfield(
    boundingBox: PlotBackgroundInfo,
    chartObject: Highcharts.Chart,
  ): void;
  _toggleActive(): void;
  ngOnDestroy(): void;
}

export declare class DtChartHeatfieldActiveChange {
  source: DtChartHeatfield;
  constructor(source: DtChartHeatfield);
}

export declare type DtChartHeatfieldThemePalette = 'main' | 'error';

export declare class DtHeatfieldBase {
  _elementRef: ElementRef;
  constructor(_elementRef: ElementRef);
}

export declare function getDtHeatfieldUnsupportedChartError(): Error;

export declare const _DtColorMixinBase: Constructor<CanColor<DtThemePalette>> &
  typeof DtColorBase;

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

export declare type Constructor<T> = new (...args: any[]) => T;

export declare class DtColor extends _DtColorMixinBase
  implements CanColor<DtThemePalette> {
  constructor(elementRef: ElementRef);
}

export declare class DtColorBase {
  _elementRef: ElementRef;
  constructor(_elementRef: ElementRef);
}

export declare class DtColorModule {}

export interface DtProgressChange {
  newValue: number;
  oldValue: number;
}

export declare type DtThemePalette =
  | 'main'
  | 'accent'
  | 'warning'
  | 'error'
  | 'cta'
  | 'recovered'
  | 'neutral'
  | undefined;

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

export declare function mixinColor<T extends Constructor<HasElementRef>>(
  base: T,
  defaultColor?: DtThemePalette,
): Constructor<CanColor<DtThemePalette>> & T;
export declare function mixinColor<
  T extends Constructor<HasElementRef>,
  P extends Partial<DtThemePalette>
>(base: T, defaultColor?: P): Constructor<CanColor<P>> & T;

export declare function mixinDisabled<T extends Constructor<{}>>(
  base: T,
): Constructor<CanDisable> & T;

export declare function mixinErrorState<T extends Constructor<HasErrorState>>(
  base: T,
): Constructor<CanUpdateErrorState> & T;

export declare function mixinHasProgress<T extends Constructor<{}>>(
  base: T,
): Constructor<HasProgressValues> & T;

export declare function mixinId<T extends Constructor<{}>>(
  base: T,
  idPreset: string,
): Constructor<HasId> & T;

export declare function mixinNotifyDomExit<T extends Constructor<HasNgZone>>(
  base: T,
): Constructor<CanNotifyOnExit> & T;

export declare function mixinTabIndex<T extends Constructor<CanDisable>>(
  base: T,
  defaultTabIndex?: number,
): Constructor<HasTabIndex> & T;

export declare function setComponentColorClasses<
  T extends {
    color?: string;
  } & HasElementRef
>(component: T, color?: string): void;

export declare class DtSlider implements AfterViewInit, OnDestroy, OnInit {
    _labelUid: string;
    _sliderBackground: ElementRef<HTMLDivElement>;
    _sliderFill: ElementRef<HTMLDivElement>;
    _sliderInput: DtInput;
    _thumb: ElementRef<HTMLDivElement>;
    _trackWrapper: ElementRef<HTMLDivElement>;
    change: EventEmitter<number>;
    get disabled(): boolean;
    set disabled(disabled: boolean);
    get max(): number;
    set max(max: number);
    get min(): number;
    set min(min: number);
    get step(): number;
    set step(step: number);
    get value(): number;
    set value(value: number);
    constructor(_changeDetectorRef: ChangeDetectorRef, _zone: NgZone, _platform: Platform);
    _inputValueChanged(event: Event): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
}

export declare class DtSliderLabel {
}

export declare class DtSliderModule {
}

export declare class DtSliderUnit {
}

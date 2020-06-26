export declare class DtStep extends CdkStep implements ErrorStateMatcher {
    errorMessage: string;
    stepLabel: DtStepLabel;
    constructor(stepper: DtStepper, _errorStateMatcher: ErrorStateMatcher, stepperOptions: StepperOptions);
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean;
}

export declare class DtStepActions {
}

export declare class DtStepHeader extends CdkStepHeader implements OnDestroy {
    readonly _elementRef: ElementRef<HTMLElement>;
    active: boolean;
    index: number;
    label: DtStepLabel | string;
    selected: boolean;
    state: StepState;
    constructor(_focusMonitor: FocusMonitor, _elementRef: ElementRef<HTMLElement>);
    _stringLabel(): string | null;
    _templateLabel(): DtStepLabel | null;
    focus(): void;
    ngOnDestroy(): void;
}

export declare class DtStepLabel extends CdkStepLabel {
}

export declare class DtStepper extends CdkStepper implements AfterContentInit {
    _stepHeader: QueryList<DtStepHeader>;
    _steps: QueryList<DtStep>;
    _isNextStepActive(nextIndex: number): boolean;
    ngAfterContentInit(): void;
}

export declare class DtStepperModule {
}

export declare class DtStepperNext extends CdkStepperNext {
}

export declare class DtStepperPrevious extends CdkStepperPrevious {
}

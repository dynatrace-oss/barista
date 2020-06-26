export declare function createInViewportStream(
  element: ElementRef | Element,
  threshold?: number | number[],
): Observable<boolean>;

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

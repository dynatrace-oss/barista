/** Mocks the intersection observer and provides utility functions to mock the intersecting values of observed elements */
export class MockIntersectionObserver {
  private _observerMap = new Map();
  private _instanceMap = new Map();

  constructor() {
    // Needs to be any since we cannot access the global jest namespace otherwise
    // tslint:disable-next-line: no-any
    (global as any).IntersectionObserver = jest.fn((cb, options) => {
      const instance = {
        thresholds: Array.isArray(options.threshold)
          ? options.threshold
          : [options.threshold],
        root: options.root,
        rootMargin: options.rootMargin,
        observe: jest.fn((element: Element) => {
          this._instanceMap.set(element, instance);
          this._observerMap.set(element, cb);
        }),
        unobserve: jest.fn((element: Element) => {
          this._instanceMap.delete(element);
          this._observerMap.delete(element);
        }),
        disconnect: jest.fn(),
      };
      return instance;
    });
  }

  /** Sets the intersecting value for all observed elements */
  mockAllIsIntersecting(isIntersecting: boolean): void {
    this._observerMap.forEach((_, element) => {
      this.mockIsIntersecting(element, isIntersecting);
    });
  }

  /** Sets the intersecting value for one of the observed elements */
  mockIsIntersecting(element: Element, isIntersecting: boolean): void {
    const cb = this._observerMap.get(element);
    if (cb) {
      const entry = [
        {
          isIntersecting,
          target: element,
          intersectionRatio: isIntersecting ? 1 : 0,
        },
      ];
      cb(entry);
    } else {
      throw new Error(
        'No IntersectionObserver instance found for element. Is it still mounted in the DOM?',
      );
    }
  }

  clearMock(): void {
    // tslint:disable-next-line: no-any
    (global as any).IntersectionObserver.mockClear();
    this._instanceMap.clear();
    this._observerMap.clear();
  }
}

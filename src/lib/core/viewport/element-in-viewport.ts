import { coerceElement } from '@angular/cdk/coercion';
import { ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, flatMap, map } from 'rxjs/operators';

/** Creates a cold stream that emits whenever the intersection of the element changes */
export function createInViewportStream(
  element: ElementRef | Element,
  threshold: number | number[] = 1,
): Observable<boolean> {
  // tslint:disable-next-line: strict-type-predicates
  return typeof window !== 'undefined' &&
    // tslint:disable-next-line: no-any
    (window as Window & { IntersectionObserver: any }).IntersectionObserver
    ? new Observable<IntersectionObserverEntry[]>(observer => {
        const intersectionObserver = new IntersectionObserver(
          entries => {
            observer.next(entries);
          },
          { threshold },
        );
        intersectionObserver.observe(coerceElement(element));
        return () => {
          intersectionObserver.disconnect();
        };
      }).pipe(
        flatMap(entries => entries),
        map(entry => entry.isIntersecting),
        distinctUntilChanged(),
      )
    : of(true);
}

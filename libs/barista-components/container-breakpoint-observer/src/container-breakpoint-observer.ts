/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { coerceArray } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, Observer, Subject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DtLogger, DtLoggerFactory } from '@dynatrace/barista-components/core';

import { getDtContainerBreakpointObserverInvalidQueryError } from './container-breakpoint-observer-errors';
import {
  ElementQuery,
  QUERY_INVALID_TOKEN,
  convertQuery,
  isElementQuery,
} from './query';

const LOG: DtLogger = DtLoggerFactory.create('DtContainerBreakpointObserver');

/**
 * @internal
 * Representation of a query string.
 * Holds all necessary information to observe and next the query.
 */
interface Query {
  observable?: Observable<InternalBreakpointState>;
  observer?: Observer<InternalBreakpointState>;
  elementQuery?: ElementQuery;
  placeholderElement?: HTMLElement;
}

/** The current state of a layout breakpoint. */
export interface DtBreakpointState {
  /** Whether the breakpoint is currently matching. */
  matches: boolean;
  /**
   * A key boolean pair for each query provided to the observe method,
   * with its current matched state.
   */
  breakpoints: {
    [key: string]: boolean;
  };
}

/** The current state of a layout breakpoint. */
interface InternalBreakpointState {
  /** Whether the breakpoint is currently matching. */
  matches: boolean;
  /** The media query being to be matched */
  query: string;
}

const PLACEHOLDER_ELEMENT_CLASS =
  'dt-container-breakpoint-observer-placeholder';

@Component({
  selector: 'dt-container-breakpoint-observer',
  exportAs: 'dtContainerBreakpointObserver',
  templateUrl: 'container-breakpoint-observer.html',
  styleUrls: ['container-breakpoint-observer.scss'],
  host: {
    class: 'dt-container-breakpoint-observer',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class DtContainerBreakpointObserver implements OnDestroy {
  /**
   * @internal
   * The container that is place over the host and fills its space.
   * The intersection observer observes this elements and monitors
   * the intersections between the placeholder elements,
   * which are placed inside this container, and the container itself.
   */
  @ViewChild('container', { static: true })
  _placeholderContainer: ElementRef<HTMLElement>;

  /**
   * A list of elements that are created for the queries observed
   * by this intersection observer.
   * These are 1px lines that have the width or height of a value
   * provided by a query and are intersecting with the container.
   */
  private _placeholderElements = new Map<string, HTMLElement>();

  /**
   * Holds the list of individual queries (split up if the consumer applies multiple).
   * Beside containing the string representation of the query (key),
   * we also create and store a query object which contains
   * the observable the consumer subscribes to,
   * the observer thats been nexted when the placeholder element
   * of the query intersects with the container,
   * the placeholder element itself and
   * the element query which is a object representation of the query string.
   */
  private _queries = new Map<string, Query>();

  /** A subject for all other observables to takeUntil based on. */
  private _destroy = new Subject<void>();

  /** The the intersection observer that will be created for this container element. */
  private _intersectionObserver: IntersectionObserver | null = null;

  constructor(
    private _zone: NgZone,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(DOCUMENT) private _document: any,
  ) {}

  ngOnDestroy(): void {
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
    }

    // Complete all query observers
    for (const query of Array.from(this._queries.values())) {
      if (query.observer) {
        query.observer.complete();
      }
    }

    this._destroy.next();
    this._destroy.complete();
  }

  /**
   * Gets an observable of results for the given queries that will
   * emit new results for any changes in matching of the given queries.
   */
  observe(value: string | string[]): Observable<DtBreakpointState> {
    const queries = splitQueries(coerceArray(value));
    const observables = queries
      .map(
        (query) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this._registerQuery(query) && this._registerQuery(query)!.observable!,
      )
      .filter(Boolean) as Observable<InternalBreakpointState>[];

    return combineLatest(observables).pipe(
      map((breakpointStates) => {
        const response: DtBreakpointState = {
          matches: true,
          breakpoints: {},
        };
        breakpointStates.forEach((state: InternalBreakpointState) => {
          response.matches = response.matches && state.matches;
          response.breakpoints[state.query] = state.matches;
        });
        return response;
      }),
    );
  }

  /** Registers a specific query to be listened for. */
  private _registerQuery(query: string): Query | null {
    const elementQuery = convertQuery(query);
    if (elementQuery === QUERY_INVALID_TOKEN) {
      throw getDtContainerBreakpointObserverInvalidQueryError(query);
    }

    if (isElementQuery(elementQuery)) {
      const queryObj = this._queries.get(query) || { elementQuery };
      if (queryObj && queryObj.observable) {
        return queryObj;
      }

      queryObj.observable = new Observable<InternalBreakpointState>(
        (observer: Observer<InternalBreakpointState>) => {
          const intersectionObserver = this._getIntersectionObserver();

          const key = `${elementQuery.feature}-${elementQuery.value}`;
          let placeholder = this._placeholderElements.get(key) || null;
          if (!placeholder && intersectionObserver) {
            placeholder = this._createPlaceholderElement(elementQuery);
            if (placeholder) {
              intersectionObserver.observe(placeholder);
              this._placeholderElements.set(key, placeholder);
            }
          }

          if (placeholder) {
            queryObj.placeholderElement = placeholder;
            queryObj.observer = observer;
          }

          return () => {};
        },
      ).pipe(takeUntil(this._destroy));

      if (!this._queries.has(query)) {
        this._queries.set(query, queryObj);
      }
      return queryObj;
    }
    return null;
  }

  /**
   * Returns the breakpoint observer which observes the intersection
   * between the container and the placeholder element.
   * If no intersection observer is set, a new one is created.
   */
  private _getIntersectionObserver(): IntersectionObserver | null {
    this._zone.runOutsideAngular(() => {
      if (
        // eslint-disable-next-line
        typeof window !== 'undefined' &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).IntersectionObserver &&
        this._placeholderContainer
      ) {
        this._intersectionObserver = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              for (const [queryString, query] of Array.from(
                this._queries.entries(),
              )) {
                if (
                  query.placeholderElement === entry.target &&
                  query.observer &&
                  query.elementQuery
                ) {
                  this._zone.run(() => {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    query.observer!.next({
                      matches:
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        (query.elementQuery!.range === 'min' &&
                          entry.isIntersecting) ||
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        (query.elementQuery!.range === 'max' &&
                          !entry.isIntersecting),
                      query: queryString,
                    });
                  });
                }
              }
            }
          },
          { root: this._placeholderContainer.nativeElement, threshold: 1 },
        );
      }
    });
    return this._intersectionObserver;
  }

  /** Creates a placeholder element for a given element query. */
  private _createPlaceholderElement(
    elementQuery: ElementQuery,
  ): HTMLElement | null {
    if (this._placeholderContainer && this._document) {
      const placeholder: HTMLSpanElement = this._document.createElement('span');
      placeholder.style.width =
        elementQuery.feature === 'width' ? elementQuery.value : '1px';
      placeholder.style.height =
        elementQuery.feature === 'height' ? elementQuery.value : '1px';
      placeholder.className = PLACEHOLDER_ELEMENT_CLASS;
      try {
        this._placeholderContainer.nativeElement.append(placeholder);
      } catch (ex) {
        // This try/catch is there to track down the js-error described the issue #1526.
        // TODO: Remove if no errors appear in the future or if the root cause has been found.
        const hasAppendMethod =
          typeof this._placeholderContainer.nativeElement.append === 'function';
        LOG.error(
          `Could not create placeholder-container. ` +
            `Element-name: ${this._placeholderContainer.nativeElement.tagName}; ` +
            `Has append method: ${hasAppendMethod}`,
          ex,
        );
      }

      return placeholder;
    }
    return null;
  }
}

/**
 * Split each query string into separate query strings
 * if two queries are provided as comma separated.
 */
function splitQueries(queries: string[]): string[] {
  return queries
    .map((query: string) => query.split(','))
    .reduce((a1: string[], a2: string[]) => a1.concat(a2))
    .map((query) => query.trim());
}

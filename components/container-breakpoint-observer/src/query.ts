import { isObject } from '@dynatrace/barista-components/core';

export type Range = 'min' | 'max';
export type Feature = 'width' | 'height';

/** @internal A parsed object representation of a query string */
export interface ElementQuery {
  range: Range;
  feature: Feature;
  value: string;
}

const QUERY_REGEX = /^\s*\(\s*(min|max)-(width|height)\s*:\s*([\w\d]+)\s*\)\s*$/;

/** @internal */
// tslint:disable-next-line: interface-over-type-literal
export type QueryResultToken = {};
export const QUERY_INVALID_TOKEN = {};
export const QUERY_NON_BROWSER_PLATFORM_TOKEN = {};

/** @internal Whether the provided value is of type ElementQuery. */
// tslint:disable-next-line: no-any
export function isElementQuery(value: any): value is ElementQuery {
  return (
    isObject(value) &&
    value !== QUERY_INVALID_TOKEN &&
    value !== QUERY_NON_BROWSER_PLATFORM_TOKEN
  );
}

/**
 * @internal
 * Tries to convert a query string into an ElementQuery object.
 * Returns null if a convert is not possible or the query is not supported.
 */
export function convertQuery(query: string): ElementQuery | QueryResultToken {
  // tslint:disable-next-line: strict-type-predicates
  if (typeof window !== 'undefined' && window.matchMedia) {
    // First we make sure the provided media query is valid
    // by using the browser native matchMedia function.
    // If valid we get back a converted media query in the correct format,
    // otherwise we get `not all` or a corrupt string.
    const converted = window.matchMedia(query).media;

    // To filter out `not all`, corrupt strings or valid media queries
    // we do not support (such as `screen`) we run it through our RegEx.
    const parts = converted.match(QUERY_REGEX);

    return parts
      ? {
          range: parts[1] as Range,
          feature: parts[2] as Feature, // tslint:disable-line: no-magic-numbers
          value: parts[3], // tslint:disable-line: no-magic-numbers
        }
      : QUERY_INVALID_TOKEN;
  }

  return QUERY_NON_BROWSER_PLATFORM_TOKEN;
}

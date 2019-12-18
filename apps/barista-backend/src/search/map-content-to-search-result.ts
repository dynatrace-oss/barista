/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import {
  BaSearchResult,
  BaSinglePageContent,
} from '@dynatrace/barista-components/barista-definitions';
import { Index } from 'lunr';

const EXCERPT_MATCH_LENGTH = 50;

/** Checks if the result has a tag match as well. */
function isTagMatch(result: Index.Result): boolean {
  for (const tokenMetadata of Object.values(result.matchData.metadata)) {
    if (tokenMetadata.tags !== undefined) {
      return true;
    }
  }
  return false;
}

/**
 * Replace html tags in the content, to mimick the functionality that
 * cheerio used to produce the index in the first place. Preserve code blocks
 * to actually match the index positions of the search results.
 */
export function replaceHtmlInContent(content: string): string {
  const reg = /<[^>]*>/gm;
  let inCodeblock = false;
  let replacedContent = '';
  let match = reg.exec(content);

  let lastEndIndex = 0;
  while (match !== null) {
    replacedContent = `${replacedContent}${content.slice(
      lastEndIndex,
      match.index,
    )}`;
    if (match[0].includes('</code')) {
      inCodeblock = false;
    }
    // If we are in a codeblock we need to keep the tags.
    if (inCodeblock) {
      lastEndIndex = match.index;
    } else {
      lastEndIndex = match.index + match[0].length;
    }

    if (match[0].includes('<code')) {
      inCodeblock = true;
    }

    match = reg.exec(content);
  }

  // Replace custom HTML entities, to actually match up the length
  // of the original file.
  return replacedContent
    .replace(/&apos;/gm, "'")
    .replace(/&quot;/gm, '"')
    .replace(/&lt;/gm, '<')
    .replace(/&gt;/gm, '>')
    .replace(/&amp;/gm, '&')
    .replace(/&#x2013;/gm, '–');
}

/**
 * Extracts body matches and the content from the body.
 */
export function extractBodyMatches(
  contentResult: BaSinglePageContent,
  result: Index.Result,
): string[] {
  // If there is a content property present, we can assume that it is BaSinglePageContent
  // and that we can extract some content matches from the result.
  if (contentResult.hasOwnProperty('content')) {
    const contentMatches: string[] = [];
    const singlePageContent: BaSinglePageContent = contentResult as BaSinglePageContent;

    // Replace all HTML tags, as they are not counted in the index, and therefor
    // need to be removed for the positions to match up.
    const replacedContent = replaceHtmlInContent(singlePageContent.content);

    // Iterate through all tokens that have been found and check them for
    // a body match. We aggregate all positions for each token in there
    // and merge them.
    const positions: [number, number][] = [];
    for (const tokenMetadata of Object.values(result.matchData.metadata)) {
      if (tokenMetadata.body !== undefined) {
        positions.push(...tokenMetadata.body.position);
      }
    }

    // Iterate through the positions and extend them for matches
    for (let i = 0; i < positions.length; i += 1) {
      const currentPosition = positions[i];
      let lowerLimit = Math.max(
        0,
        currentPosition[0] - EXCERPT_MATCH_LENGTH / 2,
      );

      // Take into account that matches can be quite close together.
      while (
        i < positions.length &&
        positions[i][0] < currentPosition[0] + EXCERPT_MATCH_LENGTH
      ) {
        i += 1;
      }
      let upperLimit = Math.min(
        replacedContent.length,
        positions[i - 1][0] + EXCERPT_MATCH_LENGTH / 2,
      );

      // Extend lower limit backwards to find a good starting point
      // for the content string.
      while (
        lowerLimit > 0 && // lowerLimit is below the content border
        replacedContent.charAt(lowerLimit).match(/\W/) // lowerLimit is any non word character
      ) {
        lowerLimit--;
      }

      // Extend the upper limit forwards to find a good ending point
      // for the content string.
      while (
        upperLimit < replacedContent.length && // upperLimit is above the content border
        replacedContent.charAt(upperLimit).match(/\W/) // lowerLimit is any non word character
      ) {
        upperLimit++;
      }

      contentMatches.push(replacedContent.slice(lowerLimit, upperLimit));
    }
    return contentMatches;
  }
  return [];
}

/**
 * Maps the contents of a page to the found documents and populates the\
 * returning SearchResults.
 */
export function mapContentToSearchResult(
  contents: BaSinglePageContent[],
  results: Index.Result[],
): BaSearchResult[] {
  const searchResults: BaSearchResult[] = [];
  return contents.reduce<BaSearchResult[]>((aggregator, page, index) => {
    const relevantResult = results[index];

    // Extract the direct matches from the content to display them in the search.
    const contentMatches = extractBodyMatches(page, relevantResult)
      .map(match => match.trim())
      .filter(Boolean)
      .slice(0, 5);

    aggregator.push({
      title: page.title,
      url: relevantResult.ref,
      isTagMatch: isTagMatch(relevantResult),
      contentMatches,
    });
    return aggregator;
  }, searchResults);
}

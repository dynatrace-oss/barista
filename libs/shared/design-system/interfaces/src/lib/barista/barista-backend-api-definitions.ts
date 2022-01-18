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

export interface BaSearchResult {
  /** Url of the page that should be the result. */
  url: string;

  /** Title of the result page. */
  title: string;

  /** Description of the result page. */
  highlight: string;

  categorization: string;
}

export interface BaSearchResultDTO {
  /** Number of total results in the query */
  totalResults: number;

  /** Results in the response */
  results: BaSearchResult[];
}

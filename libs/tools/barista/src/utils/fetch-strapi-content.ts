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

import Axios from 'axios';
import {
  BaStrapiContentType,
  BaStrapiPage,
  BaStrapiSnippet,
  BaStrapiCTA,
  BaStrapiPageTeaser,
  BaStrapiDecisionGraphNode,
  NextStrapiPage,
  NextContentType,
} from '../types';

interface FetchContentOptions {
  publicContent: boolean;
}

interface BaristaContentListParams {
  public?: boolean;
  _limit?: number;
}

/**
 * Fetches an array of elements from Strapi CMS.
 */
export async function fetchContentList<
  T extends
    | BaStrapiPage
    | BaStrapiSnippet
    | BaStrapiPageTeaser
    | BaStrapiDecisionGraphNode
    | NextStrapiPage
>(
  contentType: BaStrapiContentType | NextContentType,
  options: FetchContentOptions,
  endpoint: string,
): Promise<T[]> {
  let requestPath = `/${contentType}`;
  const params: BaristaContentListParams = {
    _limit: 1000,
  };
  // Only fetch content set to public when building the public version of Barista
  if (options.publicContent) {
    params.public = true;
  }
  const host = `${endpoint}${requestPath}`;
  const strapiResponse = await Axios.get<T[]>(host, {
    params,
  });
  return strapiResponse.data;
}

/**
 * Fetches a single item from Strapi CMS by ID.
 */
export async function fetchContentItemById<
  T extends
    | BaStrapiPage
    | BaStrapiSnippet
    | BaStrapiPageTeaser
    | BaStrapiCTA
    | NextStrapiPage
>(
  contentType: BaStrapiContentType | NextContentType,
  id: string,
  options: FetchContentOptions,
  endpoint: string,
): Promise<T> {
  let requestPath = `/${contentType}/${id}`;
  // Only fetch content set to public when building the public version of Barista
  if (options.publicContent) {
    requestPath = `${requestPath}?public=true`;
  }
  const host = `${endpoint}${requestPath}`;
  const strapiResponse = await Axios.get<T>(host);
  return strapiResponse.data;
}

/**
 * Fetches a single item from Strapi CMS by field.
 */
export async function fetchContentItemByField<
  T extends
    | BaStrapiPage
    | BaStrapiSnippet
    | BaStrapiPageTeaser
    | BaStrapiCTA
    | NextStrapiPage
>(
  contentType: BaStrapiContentType | NextContentType,
  fieldName: string,
  fieldValue: string,
  options: FetchContentOptions,
  endpoint: string,
): Promise<T> {
  let requestPath = `/${contentType}/?${fieldName}=${fieldValue}`;
  // Only fetch content set to public when building the public version of Barista
  if (options.publicContent) {
    requestPath = `${requestPath}&public=true`;
  }
  const host = `${endpoint}${requestPath}`;
  const strapiResponse = await Axios.get<T>(host);
  return strapiResponse.data;
}

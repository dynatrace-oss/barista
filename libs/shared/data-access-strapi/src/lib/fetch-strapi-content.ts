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

interface FetchContentOptions {
  publicContent: boolean;
}

async function getStrapiContent<T>(
  requestPath: string,
  params: {},
  endpoint: string,
): Promise<T> {
  const host = `${endpoint}${requestPath}`;
  const strapiResponse = await Axios.get<T>(host, {
    params,
  });
  return strapiResponse.data;
}

/**
 * Fetches an array of elements from Strapi CMS.
 */
export async function fetchContentList<T>(
  contentType: string,
  options: FetchContentOptions,
  endpoint: string,
): Promise<T[]> {
  const params = {
    _limit: 1000,
    public: options.publicContent,
  };
  return getStrapiContent(`/${contentType}`, params, endpoint);
}

/**
 * Fetches a single item from Strapi CMS by ID.
 */
export async function fetchContentItemById<T>(
  contentType: string,
  id: string,
  options: FetchContentOptions,
  endpoint: string,
): Promise<T> {
  const params = {
    public: options.publicContent,
  };
  return getStrapiContent(`/${contentType}/${id}`, params, endpoint);
}

/**
 * Fetches a single item from Strapi CMS by field.
 */
export async function fetchContentItemByField<T>(
  contentType: string,
  fieldName: string,
  fieldValue: string,
  options: FetchContentOptions,
  endpoint: string,
): Promise<T> {
  const params = {
    public: options.publicContent,
  };
  params[fieldName] = fieldValue;
  return getStrapiContent(`/${contentType}`, params, endpoint);
}

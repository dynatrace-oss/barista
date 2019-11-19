/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import { request } from 'http';
import { StrapiContentType, BaStrapiPage, BaStrapiSnippet } from '../types';

const STRAPI_ENDPOINT = process.env.STRAPI_ENDPOINT;

interface FetchContentOptions {
  publicContent: boolean;
}

/**
 * Fetches an array of elements from Strapi CMS.
 */
export async function fetchContentList<
  T extends BaStrapiPage | BaStrapiSnippet
>(contentType: StrapiContentType, options: FetchContentOptions): Promise<T[]> {
  let requestPath = `/${contentType}`;
  // Only fetch content set to public when building the public version of Barista
  if (options.publicContent) {
    requestPath = `${requestPath}?public=true`;
  }
  return fetchContent(requestPath);
}

/**
 * Fetches a single item from Strapi CMS.
 */
export async function fetchContentItemById<
  T extends BaStrapiPage | BaStrapiSnippet
>(
  contentType: StrapiContentType,
  id: string,
  options: FetchContentOptions,
): Promise<T> {
  let requestPath = `/${contentType}/${id}`;
  // Only fetch content set to public when building the public version of Barista
  if (options.publicContent) {
    requestPath = `${requestPath}?public=true`;
  }
  return fetchContent(requestPath);
}

/**
 * Fetches data from Strapi CMS based on the given
 * requestPath.
 *
 * Read more about the Strapi Content API here
 * https://strapi.io/documentation/3.0.0-beta.x/content-api/api-endpoints.html
 */
async function fetchContent(requestPath: string): Promise<any> {
  const options = {
    hostname: STRAPI_ENDPOINT,
    port: 5100,
    path: requestPath,
    method: 'GET',
  };

  return new Promise((resolve, reject) => {
    let fullData = '';

    const req = request(options, res => {
      res.on('data', data => {
        fullData = `${fullData}${data.toString()}`;
      });

      res.on('end', () => {
        const jsonRes = JSON.parse(fullData);
        if (jsonRes.length > 0) {
          resolve(jsonRes);
        } else {
          reject(`No items for ${options.path} could be found.`);
        }
      });

      res.on('error', err => {
        reject(err);
      });
    });

    req.end();
  });
}

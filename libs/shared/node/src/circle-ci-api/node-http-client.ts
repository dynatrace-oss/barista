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

import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { Observable, Subscriber } from 'rxjs';

/**
 * Wrapped axios requests in streams to easily test them
 */
export class NodeHTTPClient {
  /** Axios instance */
  private _httpClient: AxiosInstance;

  constructor(options: Partial<AxiosRequestConfig> = {}) {
    this._httpClient = axios.create(options);
  }

  /** Wrap the request in an observable */
  request<T>(config: AxiosRequestConfig): Observable<T> {
    const request: AxiosPromise<T> = this._httpClient.request(config);

    return new Observable<T>((subscriber: Subscriber<T>) => {
      request
        .then((response: AxiosResponse<T>) => {
          subscriber.next(response.data);
          subscriber.complete();
        })
        .catch((err: Error) => {
          subscriber.error(err);
          subscriber.complete();
        });
    });
  }

  get<T>(url: string, queryParams?: object): Observable<T> {
    return this.request<T>({
      method: 'get',
      url,
      params: queryParams,
    });
  }

  post<T>(url: string, body: object, queryParams?: object): Observable<T> {
    return this.request<T>({
      method: 'post',
      url,
      params: queryParams,
      data: body,
    });
  }

  put<T>(url: string, body: object, queryParams?: object): Observable<T> {
    return this.request<T>({
      method: 'put',
      url,
      params: queryParams,
      data: body,
    });
  }

  patch<T>(url: string, body: object, queryParams?: object): Observable<T> {
    return this.request<T>({
      method: 'patch',
      url,
      params: queryParams,
      data: body,
    });
  }

  delete(url: string, queryParams?: object): Observable<void> {
    return this.request({ method: 'delete', url, params: queryParams });
  }
}

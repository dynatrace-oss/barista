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

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { DtIconType } from '@dynatrace/barista-icons';
import { Observable, of } from 'rxjs';
import { finalize, map, retry, share, tap } from 'rxjs/operators';

import { sanitizeSvg } from '@dynatrace/barista-components/core';

import { DT_ICON_CONFIGURATION, DtIconConfiguration } from './icon-config';

interface SvgIconConfig {
  name: DtIconType;
  svgElement: SVGElement | null;
}

export function getDtIconNameNotFoundError(iconName: string): Error {
  return Error(`Unable to find icon with the name "${iconName}"`);
}

export function getDtIconNoHttpProviderError(): Error {
  return Error(
    'Could not find HttpClient provider for use with angular-component icons. ' +
      'Please include the HttpClientModule from @angular/common/http in your ' +
      'app imports.',
  );
}

export function getDtIconNoConfigProviderError(): Error {
  return Error(
    'Could not find config provider for icons. ' +
      'Please use DtIconModule.forRoot or provide the config in your app module',
  );
}

/**
 * DtIconRegistry is a service that loads and provides icon svg resources by name.
 *
 * Since the icon registry deals with a global shared resource-location, we cannot have
 * more than one registry active. To ensure this use the `forRoot` method on the DtIconModule.
 */
@Injectable({ providedIn: 'root' })
export class DtIconRegistry {
  /** URLs and cached SVG elements for individual icons. */
  private _svgIconConfigs = new Map<string, SvgIconConfig>();

  /** In-progress icon fetches. Used to coalesce multiple requests to the same URL. */
  private _inProgressUrlFetches = new Map<string, Observable<string>>();

  constructor(
    @Optional()
    @Inject(DT_ICON_CONFIGURATION)
    private _config: DtIconConfiguration,
    @Optional() private _httpClient: HttpClient,
  ) {}

  /**
   * Returns an Observable that produces the icon (as an `<svg>` DOM element) with the given name.
   *
   * @param name Name of the icon to be retrieved.
   */
  getNamedSvgIcon(name: DtIconType): Observable<SVGElement> {
    // Return (copy of) cached icon if possible.
    let config = this._svgIconConfigs.get(name);

    if (!config) {
      config = { name, svgElement: null };
      this._svgIconConfigs.set(name, config);
    }

    return this._getSvgFromConfig(config);
  }

  /** Returns the cached icon for a SvgIconConfig if available, or fetches it from its URL if not. */
  private _getSvgFromConfig(config: SvgIconConfig): Observable<SVGElement> {
    if (config.svgElement) {
      // We already have the SVG element for this icon, return a copy.
      return of(cloneSvg(config.svgElement));
    }
    // Fetch the icon from the config's URL, cache it, and return a copy.
    return this._loadSvgIconFromConfig(config).pipe(
      tap((svg) => (config.svgElement = svg)),
      map((svg) => cloneSvg(svg)),
    );
  }

  /**
   * Loads the content of the icon URL specified in the SvgIconConfig and creates an SVG element
   * from it.
   */
  private _loadSvgIconFromConfig(
    iconConfig: SvgIconConfig,
  ): Observable<SVGElement> {
    if (!this._config) {
      throw getDtIconNoConfigProviderError();
    }
    const url = this._config.svgIconLocation.replace(
      new RegExp('{{name}}', 'g'),
      iconConfig.name,
    );
    return this._fetchUrl(url).pipe(
      map((svgText) => this._createSvgElementForSingleIcon(svgText)),
    );
  }

  /**
   * Returns an Observable which produces the string contents of the given URL. Results may be
   * cached, so future calls with the same URL may not cause another HTTP request.
   */
  private _fetchUrl(url: string): Observable<string> {
    if (!this._httpClient) {
      throw getDtIconNoHttpProviderError();
    }

    // Store in-progress fetches to avoid sending a duplicate request for a URL when there is
    // already a request in progress for that URL. It's necessary to call share() on the
    // Observable returned by http.get() so that multiple subscribers don't cause multiple XHRs.
    const inProgressFetch = this._inProgressUrlFetches.get(url);

    if (inProgressFetch) {
      return inProgressFetch;
    }

    const req = this._httpClient.get(url, { responseType: 'text' }).pipe(
      retry(3),
      finalize(() => this._inProgressUrlFetches.delete(url)),
      share(),
    );

    this._inProgressUrlFetches.set(url, req);
    return req;
  }

  /** Creates a DOM element from the given SVG string, and adds default attributes. */
  private _createSvgElementForSingleIcon(responseText: string): SVGElement {
    const svg = sanitizeSvg(responseText);

    // Setting the default attributes for an SVG element to be used as an icon.
    svg.setAttribute('fit', '');
    svg.setAttribute('height', '100%');
    svg.setAttribute('width', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('focusable', 'false'); // Disable IE11 default behavior to make SVGs focusable.

    return svg;
  }
}

/** Clones an SVGElement while preserving type information. */
function cloneSvg(svg: SVGElement): SVGElement {
  return svg.cloneNode(true) as SVGElement;
}

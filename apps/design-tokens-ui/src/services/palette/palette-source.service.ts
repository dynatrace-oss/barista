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

import { Injectable } from '@angular/core';

import * as paletteSource from '@dynatrace/fluid-design-tokens-meta/aliases/palette-source.alias';
import {
  FluidPaletteSourceAlias,
  FluidPaletteSource,
} from '@dynatrace/shared/barista-definitions';
// TODO: switch to lodash-es when available.
import { cloneDeep } from 'lodash';
import { stringify } from 'yaml';

const LEONARDO_BASE_URL = 'https://leonardocolor.io/';
const YAML_FILE_NAME = 'palette-source.alias.yml';

@Injectable()
export class PaletteSourceService {
  private _paletteSource: FluidPaletteSource;

  constructor() {
    // Deep copy the palette source to avoid mutating the imported object
    this._paletteSource = cloneDeep(
      (paletteSource as any).default,
    ) as FluidPaletteSource;
  }

  /** Returns all palette source aliases */
  getAllPaletteAliases(): FluidPaletteSourceAlias[] {
    return cloneDeep(this._paletteSource.aliases);
  }

  /** Returns a palette source alias by name */
  getPaletteAlias(name: string): FluidPaletteSourceAlias | undefined {
    return cloneDeep(
      this._paletteSource.aliases.find((alias) => alias.name === name),
    );
  }

  /** Overwrites the saved palette with the given name with another palette */
  setPaletteAlias(name: string, newAlias: FluidPaletteSourceAlias): void {
    let index = this._paletteSource.aliases.findIndex(
      (alias) => alias.name === name,
    );
    if (index !== -1) {
      this._paletteSource.aliases[index] = newAlias;

      // Handle the case if we ended up with duplicate names
      this._ensureUniqueAliasName(newAlias, false);
    }
  }

  /** Adds a new palette alias */
  addPaletteAlias(newAlias: FluidPaletteSourceAlias): void {
    this._ensureUniqueAliasName(newAlias, true);
    this._paletteSource.aliases.push(newAlias);
  }

  /** Deletes the palette alias with the given name. */
  deletePaletteAlias(name: string): void {
    this._paletteSource.aliases = this._paletteSource.aliases.filter(
      (alias) => alias.name !== name,
    );
  }

  /** Returns the first key color for the given palette */
  getKeyColor(palette: FluidPaletteSourceAlias): string {
    return Array.isArray(palette.keyColor)
      ? palette.keyColor[0]
      : palette.keyColor;
  }

  /** Returns an Adobe Leonardo URL the given palette */
  getLeonardoUrl(palette: FluidPaletteSourceAlias): string {
    const urlParams = new URLSearchParams();
    urlParams.set('colorKeys', this.getKeyColor(palette));
    urlParams.set('base', palette.baseColor.substring(1)); // Get rid of the '#' sign
    urlParams.set('mode', palette.colorspace);
    urlParams.set(
      'ratios',
      palette.shades.map((shade) => shade.ratio).join(','),
    );
    return `${LEONARDO_BASE_URL}?${urlParams.toString()}`;
  }

  /** Exports all palettes as a YAML file */
  exportYaml(): void {
    const yaml = stringify(this._paletteSource);

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(yaml),
    );
    element.setAttribute('download', YAML_FILE_NAME);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  /** Adds a suffix to the palette name if necessary to keep the identifiers unique */
  private _ensureUniqueAliasName(
    alias: FluidPaletteSourceAlias,
    isNew: boolean,
  ): void {
    while (
      this._paletteSource.aliases.filter((a) => a.name === alias.name).length >
      (isNew ? 0 : 1)
    ) {
      alias.name += '-2';
    }
  }
}

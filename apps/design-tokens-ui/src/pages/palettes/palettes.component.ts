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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FluidPaletteSourceAlias } from '@dynatrace/shared/barista-definitions';
import { PaletteSourceService } from '../../services/palette';
import { DEFAULT_GENERATION_OPTIONS } from '../../utils/palette-generation';

@Component({
  selector: 'design-tokens-ui-palettes',
  templateUrl: './palettes.component.html',
  styleUrls: ['./palettes.component.scss'],
})
export class PalettesComponent {
  paletteAliases: FluidPaletteSourceAlias[];

  constructor(
    private _router: Router,
    private _paletteSourceService: PaletteSourceService,
  ) {
    this.paletteAliases = _paletteSourceService.getAllPaletteAliases();
  }

  /** @internal Export palette as YAML */
  _yamlExport(): void {
    this._paletteSourceService.exportYaml();
  }

  /** @internal Adds a new palette with default shades */
  _addPalette(): void {
    // TODO: change after new naming scheme was introduced
    const palette: FluidPaletteSourceAlias = {
      name: 'new palette',
      keyColor: '#74dee6',
      baseColor: '#ffffff',
      colorspace: 'CAM02',
      type: 'adobe-leonardo',
      shades: [
        {
          name: 'lightest',
          ratio: 1.5,
          aliasName: 'color-new--light',
          comment: 'Lightest new color shade',
        },
        {
          name: 'lighter',
          ratio: 3,
          aliasName: 'color-new--lighter',
          comment: 'Lighter new color shade',
        },
        {
          name: 'light',
          ratio: 4,
          aliasName: 'color-new--light',
          comment: 'Light new color shade',
        },
        {
          name: 'base',
          ratio: 5,
          aliasName: 'color-new--base',
          comment: 'Base new color shade',
        },
        {
          name: 'dark',
          ratio: 7,
          aliasName: 'color-new--dark',
          comment: 'Dark new color shade',
        },
        {
          name: 'darker',
          ratio: 10,
          aliasName: 'color-new--darker',
          comment: 'Darker new color shade',
        },
        {
          name: 'darkest',
          ratio: 13,
          aliasName: 'color-new--darkest',
          comment: 'Darkest new color shade',
        },
      ],
      generationOptions: { ...DEFAULT_GENERATION_OPTIONS },
    };

    this._paletteSourceService.addPaletteAlias(palette);
    this._router.navigate([`/palette/${palette.name}`]);
  }
}

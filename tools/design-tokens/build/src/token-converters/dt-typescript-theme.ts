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
import { generateHeaderNoticeComment } from '../../../shared';
import { ImmutableStyleMap } from 'theo';
import { LICENSE_HEADER } from './dt-typescript';

class DesignTokensTypescriptConverter {
  private _props: any;

  constructor({ props }: any) {
    this._props = props;
  }

  renderThemes(): string {
    return `
export const THEMES = {
  ${this.renderTheme('abyss')},
  ${this.renderTheme('surface')},
};`;
  }

  renderTheme(theme: string): string {
    let output = `${theme.toUpperCase()}: {\n`;
    for (const prop of this._props) {
      output += this.renderComment(prop);
      output += `    ${this.transformName(prop.name)}: '${
        prop.value[theme]
      }',\n`;
    }
    output += '  }';

    return output;
  }

  renderComment(prop: any): string {
    return prop.comment && prop.comment.trim().length > 0
      ? `/* ${prop.comment.trim()} */\n`
      : '';
  }

  transformName(name: string): string {
    return name.toUpperCase().replace(/-+/g, '_');
  }

  render(): string {
    return [
      `${LICENSE_HEADER}\n`,
      generateHeaderNoticeComment(),
      this.renderThemes(),
      '',
    ].join('\n');
  }
}

export const dtDesignTokensTypescriptThemeConverter = (
  result: ImmutableStyleMap,
) => new DesignTokensTypescriptConverter(result.toJS()).render();

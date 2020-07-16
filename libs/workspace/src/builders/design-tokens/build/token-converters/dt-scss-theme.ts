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
import { generateHeaderNoticeComment } from '../utils';
import { ImmutableStyleMap } from 'theo';

class DesignTokensScssConverter {
  private _props: any;

  constructor({ props }: any) {
    this._props = props;
  }

  renderThemes(): string {
    let output = '';
    output += this.renderTheme('abyss');
    output += '\n';
    output += this.renderTheme('surface');
    return output;
  }

  renderTheme(theme: string): string {
    let output = `.fluid-theme--${theme} {\n`;
    for (const prop of this._props) {
      output += this.renderComment(prop);
      output += `  ${this.renderCustomProperty(
        prop.name,
        prop.value[theme],
      )}\n`;
    }
    output += '}\n';

    return output;
  }

  renderCustomProperty(name: string, value: string): string {
    return `--${name}: ${value};`;
  }

  renderComment(prop: any): string {
    return prop.comment && prop.comment.trim().length > 0
      ? `/* ${prop.comment.trim()} */\n`
      : '';
  }

  render(): string {
    return [`${generateHeaderNoticeComment()}\n`, this.renderThemes()].join(
      '\n',
    );
  }
}

export const dtDesignTokensScssThemeConverter = (result: ImmutableStyleMap) =>
  new DesignTokensScssConverter(result.toJS()).render();

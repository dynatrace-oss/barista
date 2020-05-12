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
import { generateHeaderNoticeComment } from '../generate-header-notice-comment';
import { ImmutableStyleMap } from 'theo';

class DesignTokensScssConverter {
  private _props: any;
  private _format: string;

  constructor({ props, format }: any) {
    this._props = props;
    this._format = format;
  }

  renderProps(): string {
    let output = '';
    for (const prop of this._props) {
      output += this.renderComment(prop);

      const value = prop.type === 'string' ? `"${prop.value}"` : prop.value;
      output += `\$${prop.name}: ${value} !default;\n`;

      if (prop.meta.customizable) {
        output += `${this.renderCustomProperty(
          prop.name,
          prop.value,
        )} // This property can be customized\n`;
      }
    }
    return output;
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
      output += `  ${this.renderCustomProperty(prop.name, prop.meta[theme])}\n`;
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
    let output = `${generateHeaderNoticeComment()}\n`;
    switch (this._format) {
      case 'theme':
        output += this.renderThemes();
        break;
      default:
        output += this.renderProps();
    }

    return output;
  }
}

export const dtDesignTokensScssConverter = (result: ImmutableStyleMap) =>
  new DesignTokensScssConverter(result.toJS()).render();

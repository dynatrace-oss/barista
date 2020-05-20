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

/**
 * Utility for live overwriting styles in the UI
 */
@Injectable()
export class StyleOverridesService {
  private _overrideStyleElement: HTMLStyleElement;

  constructor() {
    let styleElement = document.createElement('style');
    styleElement.appendChild(document.createTextNode(''));
    document.head.appendChild(styleElement);

    this._overrideStyleElement = styleElement;
  }

  /** Overrides a color in a given palette in the UI */
  addColorOverride(
    themeName: string,
    colorName: string,
    colorValue: string,
  ): void {
    // Any type is used since the StyleSheet type is incomplete
    const overrideStyleSheet: any = this._overrideStyleElement.sheet;
    const cssRules: CSSRuleList = overrideStyleSheet.cssRules;

    this.removeColorOverride(themeName, colorName);

    overrideStyleSheet.insertRule(
      `.fluid-theme--${themeName} { --color-${colorName}: ${colorValue}; }`,
      cssRules.length,
    );
  }

  /** Restores the original color in the UI */
  removeColorOverride(themeName: string, colorName: string): void {
    const overrideStyleSheet: any = this._overrideStyleElement.sheet;
    const cssRules: CSSRuleList = overrideStyleSheet.cssRules;

    const rule = `.fluid-theme--${themeName} { --color-${colorName}:`;
    for (let i = 0; i < cssRules.length; i++) {
      if (cssRules.item(i)!.cssText.startsWith(rule)) {
        overrideStyleSheet.deleteRule(i);
      }
    }
  }
}

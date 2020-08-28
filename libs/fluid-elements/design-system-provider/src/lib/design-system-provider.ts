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

import {
  html,
  property,
  TemplateResult,
  css,
  customElement,
  LitElement,
  CSSResult,
  unsafeCSS,
} from 'lit-element';

import * as designTokens from '@dynatrace/fluid-design-tokens';

/** Defines the possible layout density options. */
export type FluidLayoutDensity = 'default' | 'dense' | 'loose';

/** Defines the available themes. */
export type FluidTheme = 'abyss' | 'surface';

/** Type of the design tokens module */
export type FluidDesignTokens = typeof designTokens;

const supportsAdoptedStylesheets =
  'adoptedStyleSheets' in window.ShadowRoot.prototype;

// The provider itself cannot extend FluidElement
// since it would lead to a circular dependency.
@customElement('fluid-design-system-provider')
export class FluidDesignSystemProvider extends LitElement {
  /**
   * Defines the theme that should be used for child components.
   * @attr
   * @type {'abyss' | 'surface'}
   * @default 'abyss'
   */
  @property({ type: String, reflect: true })
  theme: FluidTheme = 'abyss';

  /**
   * Defines the layout density inside the provider.
   * @attr
   * @type {'default' | 'dense' | 'loose'}
   * @default 'default'
   */
  @property({ type: String, reflect: true, attribute: 'layout-density' })
  layoutDensity: FluidLayoutDensity = 'default';

  /** The design token accessor instance used to override and access tokens. */
  private _overrides = new Map<string, any>();

  /** Styles of the provider component */
  private _style: CSSStyleDeclaration;

  constructor() {
    super();

    // Sourced from https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/design-system-provider/design-system-provider.ts#L322
    if (supportsAdoptedStylesheets && this.shadowRoot !== null) {
      const sheet = new CSSStyleSheet();
      sheet.insertRule(':host{}');
      (this.shadowRoot as any).adoptedStyleSheets = [
        ...(this.shadowRoot as any).adoptedStyleSheets,
        sheet,
      ];
      this._style = (sheet.rules[0] as CSSStyleRule).style;
    } else {
      // Fallback if the browser doesn't support adopted stylesheets
      // See https://caniuse.com/#feat=mdn-api_documentorshadowroot_adoptedstylesheets
      this._style = this.style;
    }
  }

  /** Update lifecycle */
  update(props: Map<string | number | symbol, unknown>): void {
    this._style.cssText = this._renderDynamicStyle().toString();
    super.update(props);
  }

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    return html`<slot></slot>`;
  }

  /** These styles are generated dynamically based on the component attributes */
  private _renderDynamicStyle(): CSSResult {
    // Helpers to keep this code cleaner
    const token = this._getTokenForCSS.bind(this);
    const spacing = this._getSpacingForCSS.bind(this);
    const color = this._getColorForCSS.bind(this);

    return css`
      /* Legibility definitions */
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;

      /* Globals */
      --fluid-layout--multiplicator: ${token(
        `FLUID_LAYOUT_${this.layoutDensity.toUpperCase()}` as any,
      )};

      /* Spacing */
      --fluid-spacing--0: ${spacing('FLUID_SPACING_0')};
      --fluid-spacing--3x-small: ${spacing('FLUID_SPACING_3X_SMALL')};
      --fluid-spacing--2x-small: ${spacing('FLUID_SPACING_2X_SMALL')};
      --fluid-spacing--x-small: ${spacing('FLUID_SPACING_X_SMALL')};
      --fluid-spacing--small: ${spacing('FLUID_SPACING_SMALL')};
      --fluid-spacing--medium: ${spacing('FLUID_SPACING_MEDIUM')};
      --fluid-spacing--large: ${spacing('FLUID_SPACING_LARGE')};
      --fluid-spacing--x-large: ${spacing('FLUID_SPACING_X_LARGE')};
      --fluid-spacing--2x-large: ${spacing('FLUID_SPACING_2X_LARGE')};
      --fluid-spacing--3x-large: ${spacing('FLUID_SPACING_3X_LARGE')};

      /* Colors */
      --color-background: ${color('COLOR_BACKGROUND')};
      --color-maxcontrast: ${color('COLOR_MAXCONTRAST')};
      --color-primary-70: ${color('COLOR_PRIMARY_70')};
      --color-primary-80: ${color('COLOR_PRIMARY_80')};
      --color-primary-90: ${color('COLOR_PRIMARY_90')};
      --color-primary-100: ${color('COLOR_PRIMARY_100')};
      --color-primary-110: ${color('COLOR_PRIMARY_110')};
      --color-primary-120: ${color('COLOR_PRIMARY_120')};
      --color-primary-130: ${color('COLOR_PRIMARY_130')};
      --color-positive-70: ${color('COLOR_POSITIVE_70')};
      --color-positive-80: ${color('COLOR_POSITIVE_80')};
      --color-positive-90: ${color('COLOR_POSITIVE_90')};
      --color-positive-100: ${color('COLOR_POSITIVE_100')};
      --color-positive-110: ${color('COLOR_POSITIVE_110')};
      --color-positive-120: ${color('COLOR_POSITIVE_120')};
      --color-positive-130: ${color('COLOR_POSITIVE_130')};
      --color-warning-70: ${color('COLOR_WARNING_70')};
      --color-warning-80: ${color('COLOR_WARNING_80')};
      --color-warning-90: ${color('COLOR_WARNING_90')};
      --color-warning-100: ${color('COLOR_WARNING_100')};
      --color-warning-110: ${color('COLOR_WARNING_110')};
      --color-warning-120: ${color('COLOR_WARNING_120')};
      --color-warning-130: ${color('COLOR_WARNING_130')};
      --color-error-70: ${color('COLOR_ERROR_70')};
      --color-error-80: ${color('COLOR_ERROR_80')};
      --color-error-90: ${color('COLOR_ERROR_90')};
      --color-error-100: ${color('COLOR_ERROR_100')};
      --color-error-110: ${color('COLOR_ERROR_110')};
      --color-error-120: ${color('COLOR_ERROR_120')};
      --color-error-130: ${color('COLOR_ERROR_130')};
      --color-nasty-orange-70: ${color('COLOR_NASTY_ORANGE_70')};
      --color-nasty-orange-80: ${color('COLOR_NASTY_ORANGE_80')};
      --color-nasty-orange-90: ${color('COLOR_NASTY_ORANGE_90')};
      --color-nasty-orange-100: ${color('COLOR_NASTY_ORANGE_100')};
      --color-nasty-orange-110: ${color('COLOR_NASTY_ORANGE_110')};
      --color-nasty-orange-120: ${color('COLOR_NASTY_ORANGE_120')};
      --color-nasty-orange-130: ${color('COLOR_NASTY_ORANGE_130')};
      --color-hot-pink-70: ${color('COLOR_HOT_PINK_70')};
      --color-hot-pink-80: ${color('COLOR_HOT_PINK_80')};
      --color-hot-pink-90: ${color('COLOR_HOT_PINK_90')};
      --color-hot-pink-100: ${color('COLOR_HOT_PINK_100')};
      --color-hot-pink-110: ${color('COLOR_HOT_PINK_110')};
      --color-hot-pink-120: ${color('COLOR_HOT_PINK_120')};
      --color-hot-pink-130: ${color('COLOR_HOT_PINK_130')};
      --color-soylent-green-70: ${color('COLOR_SOYLENT_GREEN_70')};
      --color-soylent-green-80: ${color('COLOR_SOYLENT_GREEN_80')};
      --color-soylent-green-90: ${color('COLOR_SOYLENT_GREEN_90')};
      --color-soylent-green-100: ${color('COLOR_SOYLENT_GREEN_100')};
      --color-soylent-green-110: ${color('COLOR_SOYLENT_GREEN_110')};
      --color-soylent-green-120: ${color('COLOR_SOYLENT_GREEN_120')};
      --color-soylent-green-130: ${color('COLOR_SOYLENT_GREEN_130')};
      --color-naughty-purple-70: ${color('COLOR_NAUGHTY_PURPLE_70')};
      --color-naughty-purple-80: ${color('COLOR_NAUGHTY_PURPLE_80')};
      --color-naughty-purple-90: ${color('COLOR_NAUGHTY_PURPLE_90')};
      --color-naughty-purple-100: ${color('COLOR_NAUGHTY_PURPLE_100')};
      --color-naughty-purple-110: ${color('COLOR_NAUGHTY_PURPLE_110')};
      --color-naughty-purple-120: ${color('COLOR_NAUGHTY_PURPLE_120')};
      --color-naughty-purple-130: ${color('COLOR_NAUGHTY_PURPLE_130')};
      --color-neutral-50: ${color('COLOR_NEUTRAL_50')};
      --color-neutral-60: ${color('COLOR_NEUTRAL_60')};
      --color-neutral-70: ${color('COLOR_NEUTRAL_70')};
      --color-neutral-80: ${color('COLOR_NEUTRAL_80')};
      --color-neutral-90: ${color('COLOR_NEUTRAL_90')};
      --color-neutral-100: ${color('COLOR_NEUTRAL_100')};
      --color-neutral-110: ${color('COLOR_NEUTRAL_110')};
      --color-neutral-120: ${color('COLOR_NEUTRAL_120')};
      --color-neutral-130: ${color('COLOR_NEUTRAL_130')};
      --color-neutral-140: ${color('COLOR_NEUTRAL_140')};
      --color-neutral-150: ${color('COLOR_NEUTRAL_150')};
    `;
  }

  /**
   * Returns the overriden token value if an override exists or
   * the original token otherwise
   */
  private _getToken(
    name: keyof FluidDesignTokens,
  ): FluidDesignTokens[keyof FluidDesignTokens] {
    return this._overrides.get(name) ?? designTokens[name];
  }

  private _getTokenForCSS(name: keyof FluidDesignTokens): CSSResult {
    return unsafeCSS(`${this._getToken(name)}`);
  }

  private _getSpacingForCSS(name: keyof FluidDesignTokens): CSSResult {
    return unsafeCSS(
      `calc(${this._getToken(name)} * var(--fluid-layout--multiplicator))`,
    );
  }

  private _getColorForCSS(
    name: keyof FluidDesignTokens['THEMES']['ABYSS'],
  ): CSSResult {
    const themeTokens = this._getToken('THEMES')[this.theme.toUpperCase()];
    return unsafeCSS(`${themeTokens[name]}`);
  }
}

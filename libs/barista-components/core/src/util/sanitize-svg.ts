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

/** function that sanitizes svg input as string - it removes script tags within */
export function sanitizeSvg(svgString: string): SVGElement {
  // eslint-disable-next-line
  const div = document.createElement('div');
  // eslint-disable-next-line
  div.innerHTML = svgString;
  [].slice
    .call(div.getElementsByTagName('script'))
    .forEach((script: HTMLScriptElement) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      script.parentNode!.removeChild(script);
    });

  const svg = div.getElementsByTagName('svg')[0];

  if (!svg) {
    throw new Error('<svg> tag not found');
  }
  return svg;
}

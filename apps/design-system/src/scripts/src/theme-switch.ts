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
const THEME_ABBYS = 'fluid-theme--abyss';
const THEME_SURFACE = 'fluid-theme--surface';

export function themeSwitcher(): void {
  const themeSwitch = document.querySelector('.ds-theme-switch');
  if (themeSwitch) {
    themeSwitch.addEventListener('click', () => {
      if (document.body.classList.contains(THEME_ABBYS)) {
        document.body.classList.remove(THEME_ABBYS);
        document.body.classList.add(THEME_SURFACE);
      } else {
        document.body.classList.add(THEME_ABBYS);
        document.body.classList.remove(THEME_SURFACE);
      }
    });
  }
}

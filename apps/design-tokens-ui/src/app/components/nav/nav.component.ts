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

import { Component, Directive, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'design-tokens-ui-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  host: {
    class: 'design-tokens-ui-nav',
  },
  encapsulation: ViewEncapsulation.None,
})
export class NavComponent {}

@Directive({
  selector: 'design-tokens-ui-nav-item, [designTokensUiNavItem]',
  host: {
    class: 'design-tokens-ui-nav-item',
  },
})
export class NavItemDirective {}

@Directive({
  selector: 'design-tokens-ui-nav-logo, [designTokensUiNavLogo]',
  host: {
    class: 'design-tokens-ui-nav-logo',
  },
})
export class NavLogoDirective {}

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

import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  IterableDiffers,
  ViewEncapsulation,
} from '@angular/core';

import { DtTreeControl } from '@dynatrace/barista-components/core';
import { _DtTableBase } from '@dynatrace/barista-components/table';

/** Dynatrace Tree Table component */
@Component({
  selector: 'dt-tree-table',
  templateUrl: 'tree-table.html',
  styleUrls: ['tree-table.scss'],
  host: {
    class: 'dt-tree-table',
    '[class.dt-table-interactive-rows]': 'interactiveRows',
    role: 'treegrid',
    '[attr.aria-label]': 'ariaLabel',
  },
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class DtTreeTable<T> extends _DtTableBase<T> {
  /** The tree control that handles expanding/collapsing or rows */
  @Input() treeControl: DtTreeControl<T>;
  /**
   * The aria label for the tree-table
   * @deprecated use the native aria-label for strings and if you need a binding use [attr.aria-label]
   * @breaking-change to be removed in 6.0.0
   */
  @Input('aria-label') ariaLabel: string;

  constructor(
    differs: IterableDiffers,
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
    // tslint:disable-next-line: no-any
    @Inject(DOCUMENT) document: any,
    platform: Platform,
    @Attribute('role') role: string,
  ) {
    super(differs, changeDetectorRef, elementRef, document, platform, role);
    if (!role) {
      // We need this setAttribute here to override the attribute set in the constructor of the cdkTable
      this._elementRef.nativeElement.setAttribute('role', 'treegrid');
    }
  }
}

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

import {
  Attribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { DtIconType } from '@dynatrace/barista-icons';
import { take } from 'rxjs/operators';

import {
  DtLoggerFactory,
  setComponentColorClasses,
} from '@dynatrace/barista-components/core';

import { DtIconRegistry } from './icon-registry';

export type DtIconColorPalette =
  | 'main'
  | 'accent'
  | 'warning'
  | 'error'
  | 'cta'
  | 'recovered'
  | 'light'
  | 'dark'
  | 'critical';

const iconLogger = DtLoggerFactory.create('DtIcon');

@Component({
  selector: 'dt-icon',
  exportAs: 'dtIcon',
  template: '<ng-content></ng-content>',
  styleUrls: ['./icon.scss'],
  host: {
    role: 'img',
    class: 'dt-icon',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Disabled view encapsulation because we need to access and style
  // the dynamically loaded and generated svg elements.
  encapsulation: ViewEncapsulation.None,
})
export class DtIcon implements OnChanges {
  /** Name of the icon in the registry. */
  @Input() name: DtIconType;

  /**
   * Fill color of the svg icon.
   * We can not use the color mixin here because icon has a special extended set of colors.
   */
  @Input()
  get color(): DtIconColorPalette {
    return this._color;
  }
  set color(value: DtIconColorPalette) {
    if (value !== this._color) {
      setComponentColorClasses(this, value);
      this._color = value;
    }
  }
  private _color: DtIconColorPalette;

  constructor(
    public _elementRef: ElementRef,
    private _iconRegistry: DtIconRegistry,
    @Attribute('aria-hidden') ariaHidden: string,
  ) {
    // If the user has not explicitly set aria-hidden, mark the icon as hidden, as this is
    // the right thing to do for the majority of icon use-cases.
    if (!ariaHidden) {
      _elementRef.nativeElement.setAttribute('aria-hidden', 'true');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.name) {
      if (this.name) {
        this._iconRegistry
          .getNamedSvgIcon(this.name)
          .pipe(take(1))
          .subscribe(
            (svg) => {
              this._setSvgElement(svg);
            },
            // We do not break the app when an icon could not be loaded
            // so do only a log here
            (err: Error) => {
              iconLogger.info(
                `Error retrieving icon: ${this.name} ${err.message}`,
              );
            },
          );
      } else {
        this._clearSvgElement();
      }
    }
  }

  private _setSvgElement(svg: SVGElement): void {
    this._clearSvgElement();
    this._elementRef.nativeElement.appendChild(svg);
  }

  private _clearSvgElement(): void {
    const layoutElement: HTMLElement = this._elementRef.nativeElement;
    const childCount = layoutElement.childNodes.length;

    // Remove existing child nodes and add the new SVG element. Note that we can't
    // use innerHTML, because IE will throw if the element has a data binding.
    for (let i = 0; i < childCount; i++) {
      layoutElement.removeChild(layoutElement.childNodes[i]);
    }
  }
}

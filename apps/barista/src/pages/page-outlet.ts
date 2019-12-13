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
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Injector,
  Input,
  ViewContainerRef,
} from '@angular/core';

import { BaPageMetaBase } from '@dynatrace/barista-components/barista-definitions';
import { BaIndexPage } from './index-page/index-page';
import { BaOverviewPage } from './overview-page/overview-page';
import { BaSinglePage } from './single-page/single-page';
import { BaIconOverviewPage } from './icon-overview-page/icon-overview-page';
import { BaErrorPage } from './error-page/error-page';

const LAYOUT_PAGES_MAPPING = {
  default: BaSinglePage,
  overview: BaOverviewPage,
  iconOverview: BaIconOverviewPage,
  index: BaIndexPage,
  error: BaErrorPage,
};

/**
 * Pages that should be rendered via the ba-page-outlet
 * have to implement the BaPage interface.
 */
export interface BaPage {
  contents: BaPageMetaBase;
}

@Component({
  selector: 'ba-page-outlet',
  template: '',
  styleUrls: ['page-outlet.scss'],
  host: {
    class: 'ba-page',
  },
})
export class BaPageOutlet {
  /** Reference to the current page component. */
  private _currentPageComponentRef: ComponentRef<BaPage>;

  /** Data needed to render the page. */
  @Input()
  set content(value: BaPageMetaBase) {
    // Ignore `undefined` values that could happen if the host component
    // does not initially specify a value for the `doc` input.
    if (value) {
      this._createPage(value);
    }
  }

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _viewContainerRef: ViewContainerRef,
    private _injector: Injector,
    private _elementRef: ElementRef<HTMLElement>,
  ) {}

  /** Dynamically creates a new page component and adds it to the DOM. */
  private _createPage(contents: BaPageMetaBase): void {
    this._destroyPage();

    const pageTypeComponent = contents.layout
      ? LAYOUT_PAGES_MAPPING[contents.layout] || LAYOUT_PAGES_MAPPING.default
      : LAYOUT_PAGES_MAPPING.default;

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory<
      BaPage
    >(pageTypeComponent);

    const componentRef = this._viewContainerRef.createComponent<BaPage>(
      componentFactory,
      this._viewContainerRef.length,
      this._injector,
    );
    componentRef.instance.contents = contents;

    // At this point the component has been instantiated, so we move it to the location in the DOM
    // where we want it to be rendered.
    this._elementRef.nativeElement.appendChild(
      this._getComponentRootNode(componentRef),
    );

    this._currentPageComponentRef = componentRef;

    // Reset scroll position on new page load.
    if (window) {
      window.scrollTo({
        top: 0,
      });
    }
  }

  /** Destroys page that should be replaced by a new one. */
  private _destroyPage(): void {
    if (this._currentPageComponentRef) {
      this._currentPageComponentRef.destroy();
    }
  }

  /** Gets the root HTMLElement for an instantiated component. */
  private _getComponentRootNode(
    componentRef: ComponentRef<BaPage>,
  ): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<BaPage>)
      .rootNodes[0] as HTMLElement;
  }
}

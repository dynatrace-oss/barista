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
  Component,
  OnInit,
  ElementRef,
  ComponentFactoryResolver,
  ComponentFactory,
  ComponentRef,
  ViewContainerRef,
  Injector,
} from '@angular/core';
import { BaSinglePageContent } from '@dynatrace/shared/design-system/interfaces';
import {
  createComponent,
  DsPageService,
} from '@dynatrace/shared/design-system/ui';
import {
  BaDecisionGraph,
  BaDecisionGraphStartnode,
  BaDecisiongraphNodeNavigation,
  BaDecisionGraphNode,
} from './components/ba-decision-graph';

const BA_DECISION_GRAPH_CONTENT_COMPONENT: any[] = [
  BaDecisionGraphStartnode,
  BaDecisiongraphNodeNavigation,
  BaDecisionGraphNode,
  BaDecisionGraph,
];

@Component({
  selector: 'decision-graph-page',
  templateUrl: 'decision-graph-page.html',
  styleUrls: ['decision-graph-page.scss'],
})
export class BaDecisionGraphPage implements OnInit {
  _pageContent = this._pageService._getCurrentPage();

  _content: string;

  private _componentFactories: ComponentFactory<any>[] = [];

  private _componentRefs: ComponentRef<any>[] = [];

  constructor(
    private _pageService: DsPageService<BaSinglePageContent>,
    private _elementRef: ElementRef<HTMLElement>,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _viewContainerRef: ViewContainerRef,
    private _injector: Injector,
  ) {
    this._componentFactories = BA_DECISION_GRAPH_CONTENT_COMPONENT.map(
      (componentType) =>
        this._componentFactoryResolver.resolveComponentFactory(componentType),
    );
  }

  ngOnInit(): void {
    if (this._pageContent) {
      this._content = this._pageContent.content;
    }
    this._elementRef.nativeElement.innerHTML = this._content;
    this._createContentComponents();
  }

  private _createContentComponents(): void {
    this._destroyContentComponents();

    for (const factory of this._componentFactories) {
      const placeholderElements: HTMLElement[] = Array.from(
        this._elementRef.nativeElement.querySelectorAll(factory.selector),
      );
      for (const el of placeholderElements) {
        this._componentRefs.push(
          createComponent(factory, this._viewContainerRef, this._injector, el),
        );
      }
    }
  }

  private _destroyContentComponents(): void {
    for (const ref of this._componentRefs) {
      ref.destroy();
    }
    this._componentRefs = [];
  }
}

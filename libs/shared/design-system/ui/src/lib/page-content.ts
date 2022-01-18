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
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  ViewContainerRef,
  InjectionToken,
  Inject,
  Type,
} from '@angular/core';

import { createComponent } from './utils/create-component';

export const DS_CONTENT_COMPONENT_LIST_TOKEN = new InjectionToken<
  Type<unknown>[]
>('DsContentComponentList');

@Component({
  selector: 'ds-page-content',
  template: '',
})
export class DsPageContent implements OnDestroy {
  /** Represents the content of a page. It contains text and component selectors */
  @Input()
  get data(): string {
    return this._data;
  }
  set data(value: string) {
    this._data = value;
    this._elementRef.nativeElement.innerHTML = value;
    this._elementRef.nativeElement.setAttribute('id', 'all-content');
    this._createContentComponents();
  }
  private _data = '';

  private _componentFactories: ComponentFactory<any>[] = [];

  private _componentRefs: ComponentRef<any>[] = [];

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _viewContainerRef: ViewContainerRef,
    private _injector: Injector,
    @Inject(DS_CONTENT_COMPONENT_LIST_TOKEN)
    private _componentList: Type<unknown>[],
  ) {
    this._componentFactories = this._componentList.map((componentType) =>
      this._componentFactoryResolver.resolveComponentFactory(componentType),
    );
  }

  ngOnDestroy(): void {
    this._destroyContentComponents();
  }

  private _createContentComponents(): void {
    this._destroyContentComponents();

    for (const factory of this._componentFactories) {
      const placeholderElements: HTMLElement[] = Array.from(
        this._elementRef.nativeElement.querySelectorAll(factory.selector),
      );

      for (const el of placeholderElements) {
        const children = [].slice.call(el.childNodes);
        this._componentRefs.push(
          createComponent(factory, this._viewContainerRef, this._injector, el, [
            ...children,
          ]),
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

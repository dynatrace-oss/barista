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
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';

import { BA_CONTENT_COMPONENTS } from '../components/index';
import { createComponent } from '../utils/create-component';

@Component({
  selector: 'ba-page-content',
  template: '',
})
export class BaPageContent implements OnDestroy {
  @Input()
  get data(): string {
    return this._data;
  }
  set data(value: string) {
    this._data = value;

    // tslint:disable-next-line dt-ban-inner-html
    this._elementRef.nativeElement.innerHTML = value;
    this._elementRef.nativeElement.setAttribute('id', 'all-content');
    this._createContentComponents();
  }
  private _data = '';

  // tslint:disable-next-line: no-any
  private _componentFactories: ComponentFactory<any>[] = [];

  private _componentRefs: ComponentRef<any>[] = [];

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _viewContainerRef: ViewContainerRef,
    private _injector: Injector,
  ) {
    this._componentFactories = BA_CONTENT_COMPONENTS.map(componentType =>
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

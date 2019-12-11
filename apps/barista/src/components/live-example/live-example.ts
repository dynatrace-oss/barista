/**
 * @license
 * Copyright 2019 Dynatrace LLC
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
  Input,
  ComponentFactoryResolver,
  Injector,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  ComponentRef,
  OnDestroy,
} from '@angular/core';
import { EXAMPLES_MAP } from '@dynatrace/barista-components/examples';
import { createComponent } from '../../utils/create-component';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'ba-live-example',
  templateUrl: 'live-example.html',
  styleUrls: ['live-example.scss'],
  host: {
    '[class.ba-live-example-dark]': 'themedark',
    '[class.ba-live-example-full-width]': 'fullwidth',
  },
})
export class BaLiveExample implements OnDestroy {
  /** The name of the example (class name) that will be instantiated. */
  @Input()
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
    this._initExample();
  }
  private _name: string;

  /** Whether the example should run in the dark theme. */
  @Input()
  get themedark(): boolean {
    return this._hasThemeDark;
  }
  set themedark(value: boolean) {
    this._hasThemeDark = coerceBooleanProperty(value);
  }
  private _hasThemeDark = false;

  /** Whether the example needs the full width of barista. */
  @Input()
  get fullwidth(): boolean {
    return this._isFullWidth;
  }
  set fullwidth(value: boolean) {
    this._isFullWidth = coerceBooleanProperty(value);
  }
  private _isFullWidth = false;

  /** The encoded html template source of the given example. */
  @Input()
  get templateSource(): string {
    return this._templateSource;
  }
  set templateSource(value: string) {
    this._templateSource = value;
    if (!this._activeTabChanged) {
      this._activeTab = 'html';
    }
  }
  private _templateSource: string;

  /** The encoded typescript class (component) source of the given example. */
  @Input()
  get classSource(): string {
    return this._classSource;
  }
  set classSource(value: string) {
    this._classSource = value;
    if (!this._activeTabChanged && !this._activeTab) {
      this._activeTab = 'ts';
    }
  }
  private _classSource: string;

  /**
   * @internal
   * The placeholder element that will be replaced with
   * the example element once it is instantiated.
   */
  @ViewChild('demoPlaceholder', { read: ElementRef, static: true })
  _placeholder: ElementRef;

  /** @internal The component-ref of the instantiated class. */
  _componentRef: ComponentRef<unknown>;

  /**
   * @internal
   * The currently active tab for displaying a source (html, ts or scss).
   */
  _activeTab: 'html' | 'ts' | 'scss';

  /** Whether the user has changed the active tab. */
  private _activeTabChanged = false;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _injector: Injector,
    private _viewContainerRef: ViewContainerRef,
  ) {}

  ngOnDestroy(): void {
    if (this._componentRef) {
      this._componentRef.destroy();
    }
  }

  /** Whether one of the three sources has been set. */
  _hasSources(): boolean {
    return Boolean(this.classSource || this.templateSource);
  }

  _setActiveTab(tab: 'html' | 'ts' | 'scss'): void {
    this._activeTab = tab;
    this._activeTabChanged = true;
  }

  private _initExample(): void {
    const exampleType = EXAMPLES_MAP.get(this._name);
    if (exampleType) {
      const factory = this._componentFactoryResolver.resolveComponentFactory(
        exampleType,
      );
      this._componentRef = createComponent(
        factory,
        this._viewContainerRef,
        this._injector,
        this._placeholder.nativeElement,
        true,
      );
    }
  }
}

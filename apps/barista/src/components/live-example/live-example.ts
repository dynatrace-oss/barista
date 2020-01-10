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
  Input,
  ComponentFactoryResolver,
  Injector,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  ComponentRef,
  OnDestroy,
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { EXAMPLES_MAP } from '@dynatrace/barista-components/examples';
import { timer, Subscription } from 'rxjs';
import {
  Highlighter,
  registerLanguages,
  htmlRender,
  init,
  process,
  TypeScript,
  XML,
} from 'highlight-ts';

import { createComponent } from '../../utils/create-component';
import { wrapCodeLines } from '../../utils/wrap-code-lines';
import { BaCopyToClipboardService } from '../../shared/copy-to-clipboard.service';

type BaSourceType = 'html' | 'ts' | 'scss';

@Component({
  selector: 'ba-live-example',
  templateUrl: 'live-example.html',
  styleUrls: ['live-example.scss'],
  host: {
    class: 'ba-live-example',
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

  /** Whether the example needs a colored background. */
  @Input()
  get background(): boolean {
    return this._background;
  }
  set background(value: boolean) {
    this._background = coerceBooleanProperty(value);
  }
  private _background = false;

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
    this._enhancedTemplateSource = this._enhanceCode(value, 'html');
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
    this._enhancedClassSource = this._enhanceCode(value, 'ts');
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
  _activeTab: BaSourceType;

  /** @internal Whether the source code is hidden. */
  _sourceHidden = false;

  /** @internal Whether the source code is expanded to its max height. */
  _isExpanded = false;

  /** @internal Whether the source code has been copied. */
  _copied = false;

  /** @internal Enhanced template source with line wrappers and code highlighting. */
  _enhancedTemplateSource: string;

  /** @internal Enhanced class source with line wrappers and code highlighting. */
  _enhancedClassSource: string;

  private _timerSubscription = Subscription.EMPTY;

  /** Whether the user has changed the active tab. */
  private _activeTabChanged = false;

  /** Highlighter for highlight-ts syntax highlighting. */
  private _highlighter: Highlighter<string>;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _injector: Injector,
    private _viewContainerRef: ViewContainerRef,
    private _platform: Platform,
    private _ctcService: BaCopyToClipboardService,
  ) {
    registerLanguages(TypeScript, XML);
    this._highlighter = init(htmlRender);
  }

  ngOnDestroy(): void {
    if (this._componentRef) {
      this._componentRef.destroy();
    }
    this._timerSubscription.unsubscribe();
  }

  /** @internal Whether one of the three sources has been set. */
  _hasSources(): boolean {
    return Boolean(this.classSource || this.templateSource);
  }

  /** @internal Sets the active tab. */
  _setActiveTab(tab: BaSourceType): void {
    this._activeTab = tab;
    this._activeTabChanged = true;
  }

  /** @internal Copies content of currently active tab to clipboard. */
  _copyToClipboard(): void {
    if (this._platform.isBrowser) {
      let copySucceeded = false;
      switch (this._activeTab) {
        case 'html':
          copySucceeded = this._ctcService.copy(this._templateSource, true);
          break;
        case 'ts':
          copySucceeded = this._ctcService.copy(this._classSource, true);
          break;
        case 'scss':
          // TODO: copySucceeded = this._ctcService.copy(this._scssSource, true)
          break;
      }

      if (copySucceeded) {
        this._copySuccess();
      }
    }
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

  /**
   * Updates value of behavior subject after
   * successful copy to clipboard action.
   */
  private _copySuccess(): void {
    this._copied = true;
    this._timerSubscription = timer(1000).subscribe(
      () => (this._copied = false),
    );
  }

  /**
   * Transforms given code by replacing empty lines,
   * and wrapping each line in a span element.
   */
  private _enhanceCode(code: string, type: BaSourceType): string {
    // Remove empty lines at the start of the source
    let transformedCode = code.replace(/^(\s*\r?\n)*/g, '');
    // Remove empty lines at the end of the source
    transformedCode = transformedCode.replace(/(\r?\n\s*)*$/g, '');

    // highlight-ts needs 'xml' as type instead of 'html'
    const highlightType = type === 'html' ? 'xml' : type;
    // Add syntax highlighting using highlight-ts
    transformedCode = process(this._highlighter, transformedCode, highlightType)
      .value;

    return wrapCodeLines(transformedCode, 'ba-live-example-code-line');
  }
}

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

import { BaPageContents } from '../shared/page-contents';
import { BaComponentPage } from './component-page/component-page';
import { BaSimplePage } from './simple-page/simple-page';

const LAYOUT_PAGES_MAPPING = {
  default: BaSimplePage,
  component: BaComponentPage,
};

/**
 * Pages that should be rendered via the ba-page-outlet
 * have to implement the BaPage interface.
 */
export interface BaPage {
  content: BaPageContents;
}

@Component({
  selector: 'ba-page-outlet',
  template: '',
})
export class BaPageOutlet {
  /** Reference to the current page component. */
  private _currentPageComponentRef: ComponentRef<BaPage>;

  /** Data needed to render the page. */
  @Input()
  set content(value: BaPageContents) {
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
  private _createPage(contents: BaPageContents): void {
    this._destroyPage();

    const pageTypeComponent =
      LAYOUT_PAGES_MAPPING[contents.layout] || LAYOUT_PAGES_MAPPING.default;

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory<
      BaPage
    >(pageTypeComponent);

    const componentRef = this._viewContainerRef.createComponent<BaPage>(
      componentFactory,
      this._viewContainerRef.length,
      this._injector,
    );
    componentRef.instance.content = contents;

    // At this point the component has been instantiated, so we move it to the location in the DOM
    // where we want it to be rendered.
    this._elementRef.nativeElement.appendChild(
      this._getComponentRootNode(componentRef),
    );

    this._currentPageComponentRef = componentRef;
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

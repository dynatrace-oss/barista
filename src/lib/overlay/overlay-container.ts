import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ComponentRef,
  EmbeddedViewRef,
  ElementRef,
  Component,
  ViewChild,
  Attribute,
} from '@angular/core';
import {
  HasTabIndex,
  mixinTabIndex,
  mixinDisabled,
} from '@dynatrace/angular-components/core';
import { BasePortalOutlet, ComponentPortal, CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';

// Boilerplate for applying mixins to DtOverlay.
class BasePortal extends BasePortalOutlet {
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    const compRef = {};
    return compRef as ComponentRef<T>;
  }
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    const compRef = {};
    return compRef as EmbeddedViewRef<C>;
  }
}

export const _DtOverlayMixinBase = mixinTabIndex(mixinDisabled(BasePortal));

@Component({
  moduleId: module.id,
  selector: 'dt-overlay-container',
  templateUrl: 'overlay-container.html',
  styleUrls: ['overlay-container.scss'],
  host: {
    'class': 'dt-overlay-container',
    'attr.aria-hidden': 'true',
  },
  inputs: ['tabIndex'],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtOverlayContainer extends _DtOverlayMixinBase implements HasTabIndex {
  @ViewChild(CdkPortalOutlet) _portalOutlet: CdkPortalOutlet;

  constructor(@Attribute('tabindex') tabIndex: string, public elementRef: ElementRef) {
    super();
    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  /**
   * Attach a ComponentPortal as content to this overlay container.
   */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalOutlet.hasAttached()) {
      throw Error('already attached');
    }
    return this._portalOutlet.attachComponentPortal(portal);
  }

  /**
   * Attach a TemplatePortal as content to this overlay container.
   */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached()) {
      throw Error('already attached');
    }
    return this._portalOutlet.attachTemplatePortal(portal);
  }
}

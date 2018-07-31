import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ComponentRef,
  EmbeddedViewRef,
  Component,
  ViewChild,
} from '@angular/core';
import { BasePortalOutlet, ComponentPortal, CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';

@Component({
  moduleId: module.id,
  selector: 'dt-overlay-container',
  templateUrl: 'overlay-container.html',
  styleUrls: ['overlay-container.scss'],
  host: {
    'class': 'dt-overlay-container',
    'attr.aria-hidden': 'true',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtOverlayContainer extends BasePortalOutlet {
  @ViewChild(CdkPortalOutlet) _portalOutlet: CdkPortalOutlet;

  constructor() {
    super();
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

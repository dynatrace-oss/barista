import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ComponentRef,
  ViewChild,
  EmbeddedViewRef,
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
  // public _trigger: CdkOverlayOrigin;

  // public isOpen: BehaviorSubject<boolean>;
  // public hasBackdrop: boolean;
  // private _subscription;
  // private _backdrop: Subscription;
  // public hasBackdrop: boolean;

  constructor() {
    super();
    // this.isOpen = this._dtOverlayService.panelOpen;
    // this._backdrop = _dtOverlayService.hasBackdrop.subscribe((value: boolean)=> {
    //   console.log('backdrop subscription', value)
    //   this.hasBackdrop = value;
    //   this._changeDetectorRef.markForCheck();
    // });
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

import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, ConnectionPositionPair, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  Component,
  ChangeDetectionStrategy,
  isDevMode,
  ViewEncapsulation,
  ComponentRef,
  ViewChild,
  EmbeddedViewRef,
  ElementRef,
  Attribute,
  Output,
  EventEmitter,
} from '@angular/core';
import { DtOverlayService } from './overlay';
import {
  HasTabIndex,
  DtLogger,
  DtLoggerFactory,
  mixinTabIndex,
  mixinDisabled,
} from '../core/index';
import { BasePortalOutlet, ComponentPortal, CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { debounceTime, filter, map, switchMap, switchMapTo, startWith, takeUntil } from 'rxjs/operators';

// Logger
const LOG: DtLogger = DtLoggerFactory.create('Overlay');

// Boilerplate for applying mixins to DtOverlay.

class X extends BasePortalOutlet {
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    return {} as ComponentRef<T>;
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    return {} as EmbeddedViewRef<C>;
  }
}

export const _DtOverlayMixinBase = mixinTabIndex(mixinDisabled(X));

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

  constructor(
    @Attribute('tabindex') tabIndex: string,
  ) {
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

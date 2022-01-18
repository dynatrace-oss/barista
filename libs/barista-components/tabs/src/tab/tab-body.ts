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

import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Directive,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';

/**
 * Wrapper for the contents of a tab.
 * notifies the portaloutlet when the active input is changed to enable lazy loading
 */
@Component({
  selector: 'dt-tab-body',
  templateUrl: 'tab-body.html',
  styleUrls: ['tab-body.scss'],
  exportAs: 'dtTabBody',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dt-tab-body',
    '[class.dt-tab-body-active]': 'active',
  },
})
export class DtTabBody {
  /**
   * @internal
   * The portal host inside of this container into which
   * the tab body content will be loaded.
   */
  @ViewChild(CdkPortalOutlet, { static: true })
  _portalHost: CdkPortalOutlet;

  /** The tab body content to display. */
  @Input() content: TemplatePortal;

  /** Input to be used in the tab-group to set the active tab */
  @Input()
  get active(): boolean {
    return this._isActive;
  }
  set active(value: boolean) {
    this._isActive = coerceBooleanProperty(value);
    this._activeChanged.emit(value);
  }
  static ngAcceptInputType_active: BooleanInput;

  /** @internal Emits events whenever the active input changes */
  @Output() readonly _activeChanged: EventEmitter<boolean> = new EventEmitter();

  private _isActive = false;
}

/**
 * The portal outlet directive for the contents of the tab.
 */
@Directive({
  selector: '[dtTabBodyPortalOutlet]',
  exportAs: 'dtTabBodyPortalOutlet',
})
export class DtTabBodyPortalOutlet
  extends CdkPortalOutlet
  implements OnInit, OnDestroy
{
  /** Subscription to events for when the active tab changes */
  private _activeChangedSub = Subscription.EMPTY;

  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    // eslint-disable-next-line @angular-eslint/no-forward-ref
    @Inject(forwardRef(() => DtTabBody)) private _host: DtTabBody,
  ) {
    super(componentFactoryResolver, viewContainerRef);
  }

  /** Set initial visibility or set up subscription for changing visibility. */
  ngOnInit(): void {
    super.ngOnInit();
    this._handleActiveTabChange(this._host.active);
    this._activeChangedSub = this._host._activeChanged.subscribe((isActive) => {
      this._handleActiveTabChange(isActive);
    });
  }

  /** Attaches the content to the portal outlet if necessary */
  private _handleActiveTabChange(active: boolean): void {
    if (active && !this.hasAttached() && this._host && this._host.content) {
      this.attach(this._host.content);
    }
  }

  /** Clean up subscription. */
  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.detach();
    this._activeChangedSub.unsubscribe();
  }
}

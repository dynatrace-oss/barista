import {
  CdkPortalOutlet,
  PortalHostDirective,
  TemplatePortal,
} from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Directive,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';

/**
 * Wrapper for the contents of a tab.
 * notifies the portaloutlet when the active input is changed to enable lazy loading
 * @internal
 */
@Component({
  moduleId: module.id,
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
  /** The portal host inside of this container into which the tab body content will be loaded. */
  @ViewChild(PortalHostDirective, { static: true })
  _portalHost: PortalHostDirective;

  /** The tab body content to display. */
  @Input() content: TemplatePortal;

  /** Input to be used in the tab-group to set the active tab */
  @Input()
  get active(): boolean {
    return this._isActive;
  }
  set active(value: boolean) {
    this._isActive = value;
    this._activeChanged.emit(value);
  }

  /** emits events whenever the active input changes */
  @Output() readonly _activeChanged: EventEmitter<boolean> = new EventEmitter();

  private _isActive = false;
}

/**
 * The portal host directive for the contents of the tab.
 * @internal
 */
@Directive({
  selector: '[dtTabBodyHost]',
})
export class DtTabBodyPortal extends CdkPortalOutlet
  implements OnInit, OnDestroy {
  /** Subscription to events for when the active tab changes */
  private _activeChangedSub = Subscription.EMPTY;

  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    // tslint:disable-next-line:no-forward-ref
    @Inject(forwardRef(() => DtTabBody)) private _host: DtTabBody
  ) {
    super(componentFactoryResolver, viewContainerRef);
  }

  /** Set initial visibility or set up subscription for changing visibility. */
  ngOnInit(): void {
    super.ngOnInit();
    this._handleActiveTabChange(this._host.active);
    this._activeChangedSub = this._host._activeChanged.subscribe(isActive => {
      this._handleActiveTabChange(isActive);
    });
  }

  /**  Attaches the content to the portaloutlet if necessary */
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

import { Component, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, Input, Directive, OnInit, OnDestroy, ComponentFactoryResolver, ViewContainerRef, forwardRef, Inject, Output, EventEmitter } from '@angular/core';
import { PortalHostDirective, TemplatePortal, CdkPortalOutlet } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';

/**
 * The portal host directive for the contents of the tab.
 * @internal
 */
@Directive({
  selector: '[dtTabBodyHost]',
})
export class DtTabBodyPortal extends CdkPortalOutlet implements OnInit, OnDestroy {
  /** Subscription to events for when the tab active changes */
  private _activeChangedSub = Subscription.EMPTY;

  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    // tslint:disable-next-line:no-forward-ref
    @Inject(forwardRef(() => DtTabBody)) private _host: DtTabBody) {
      super(componentFactoryResolver, viewContainerRef);
  }

  /** Set initial visibility or set up subscription for changing visibility. */
  ngOnInit(): void {
    super.ngOnInit();

    this._activeChangedSub = this._host._activeChanged.subscribe((isActive) => {
      if (isActive && !this.hasAttached()) {
        this.attach(this._host.content);
      }
    });
  }

  /** Clean up subscription. */
  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.detach();
    this._activeChangedSub.unsubscribe();
  }
}

/**
 * Wrapper for the contents of a tab.
 * @internal
 */
@Component({
  moduleId: module.id,
  selector: 'dt-tab-body',
  templateUrl: 'tab-body.html',
  styleUrls: ['tab-body.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'dt-tab-body',
    '[class.dt-tab-body-active]': 'active',
  },
})
export class DtTabBody {
   /** The portal host inside of this container into which the tab body content will be loaded. */
  @ViewChild(PortalHostDirective) _portalHost: PortalHostDirective;

  /** The tab body content to display. */
  @Input() content: TemplatePortal;

  @Input()
  get active(): boolean { return this._isActive; }
  set active(value: boolean) {
    this._isActive = value;
    this._activeChanged.emit(value);
    console.log('active setter called', value);
  }

  @Output() readonly _activeChanged: EventEmitter<boolean> = new EventEmitter();

  private _isActive = false;

}

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { DtOverlay, DtOverlayRef } from '@dynatrace/barista-components/overlay';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <ng-template #overlay let-tooltip>
      Hello
      {{ tooltip.value }}
    </ng-template>
    <button
      dt-button
      (mouseenter)="createOverlay()"
      (mouseleave)="dismiss()"
      (click)="pinOverlay()"
    >
      Pin overlay: {{ overlayRef?.pinned }}
    </button>
    <button dt-button (click)="updateContext()">Update context</button>

    <p><span #origin>An overlay will be created here</span></p>
  `,
})
export class OverlayImplicitContextExample implements OnInit, OnDestroy {
  i = 0;

  @ViewChild('origin', { static: true }) origin: ElementRef;

  @ViewChild('overlay', { static: true, read: TemplateRef })
  // tslint:disable-next-line: no-any
  overlayTemplate: TemplateRef<any>;

  /** Interval reference to clear up the interval on destroy */
  private _interval: number | undefined;

  constructor(
    private _dtOverlay: DtOverlay,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.updateContext();
    }, 1500);
  }

  ngOnDestroy(): void {
    clearInterval(this._interval);
  }

  // tslint:disable-next-line: no-any
  overlayRef: DtOverlayRef<any> | null;

  createOverlay(): void {
    if (!this.overlayRef) {
      this.overlayRef = this._dtOverlay.create(
        this.origin,
        this.overlayTemplate,
        // Initialize the implicit content with an empty object
        // this is required to actually be able to update it later
        { data: { value: this.i }, pinnable: true },
      );
    }
  }

  /** Pin the overlay */
  pinOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.pin(!this.overlayRef.pinned);
    }
  }

  /** Update the context with some arbitrary values. */
  updateContext(): void {
    this.i += 1;
    if (this.overlayRef) {
      this.overlayRef.updateImplicitContext({
        value: this.i,
      });
      this.changeDetectorRef.markForCheck();
    }
  }

  dismiss(): void {
    if (this.overlayRef && !this.overlayRef.pinned) {
      this._dtOverlay.dismiss();
      this.overlayRef = null;
    }
  }
}

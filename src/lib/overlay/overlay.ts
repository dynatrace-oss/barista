import { Injectable } from '@angular/core';
import { DtOverlayConfig } from './overlay-config'
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class DtOverlayService {
  private _overlayRef: OverlayRef;

  public panelOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public hasBackdrop: Subject<boolean> = new Subject();
  // public hasBackdrop: boolean = false;

  private _stay: boolean = false;

  // public hasBackdrop: boolean = false;

  constructor(
    private _overlay: Overlay
  ) {}

  public create<T>(origin: any, config?: DtOverlayConfig): OverlayRef {
    // if(this._overlayRef) {
      // error....
    // }  else {
      this._overlayRef = this._overlay.create();
    // }
    return this._overlayRef;
  }

  public openHover(): void {
    this.hasBackdrop.next(false);
    this.panelOpen.next(true);
    console.log('open hover')
  }

  public closeHover(): void {
    if(!this._stay) {
      this.panelOpen.next(false);
      this.hasBackdrop.next(false);
      this._overlayRef.detach();
      this._overlayRef.dispose();
      console.log('close hover')
    }
  }

  // public open(hasBackdrop: boolean): void {
  //   this._overlayRef.detach()
  //   this._setOpen(true, hasBackdrop);
  // }

  public stay(hasBackdrop: boolean, origin): void {
    this._stay = true;

    this.panelOpen.next(false);

    this._overlayRef.dispose();
    this._overlayRef.detach();

    console.log(this._overlayRef);

    this.hasBackdrop.next(true);
    this.panelOpen.next(true);

    this.create(origin);

    console.log('stay')
  }

  public close(): void {
    // this._overlayRef = null;
    // this._overlayRef.detach()
    this.panelOpen.next(false);
    this.hasBackdrop.next(false);
    // this._setOpen(false, false);
  }

  // private _setOpen(open: boolean, hasBackdrop: boolean): void {
  //   this.panelOpen.next(open);
  //   this.hasBackdrop.next(hasBackdrop);
  // }
}

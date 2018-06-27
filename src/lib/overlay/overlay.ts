import { Injectable, TemplateRef, ElementRef } from '@angular/core';
import { DtOverlayConfig } from './overlay-config';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, TemplatePortal } from '@angular/cdk/portal';
import { DtOverlayContainer } from './overlay-container';
import { DtOverlayRef, DT_OVERLAY_NO_POINTER_CLASS } from './overlay-ref';

export const DEFAULT_DT_OVERLAY_CONFIG: DtOverlayConfig = {
  enableClick: true,
  hasBackdrop: true,
  enableMouseMove: true,
  backdropClass: ['cdk-overlay-transparent-backdrop', DT_OVERLAY_NO_POINTER_CLASS],
};

@Injectable({ providedIn: 'root'})
export class DtOverlayService {
  private _overlayRef: DtOverlayRef | null;

  get overlayRef(): DtOverlayRef | null { return this._overlayRef; }
  // panelOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  // hasBackdrop: Subject<boolean> = new Subject();
  // public hasBackdrop: boolean = false;

  // public hasBackdrop: boolean = false;

  constructor(
    private _overlay: Overlay
  ) {}

  create<T>(origin: ElementRef, componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, c?: DtOverlayConfig): DtOverlayRef {

    const positionStrategy = this._overlay.position()
    .flexibleConnectedTo(origin)
    .withPositions([{
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
    }]);
    const config = { ...DEFAULT_DT_OVERLAY_CONFIG, positionStrategy, ...c };

    const overlayRef = this._overlay.create(config as OverlayConfig);
    const overlayContainer = this._attachOverlayContainer(overlayRef);
    this._attachOverlayContent(componentOrTemplateRef, overlayContainer);
    this._overlayRef = new DtOverlayRef(overlayRef);
    return this._overlayRef;
  }

  close(): void {
    const ref = this._overlayRef;
    if (ref) {
      ref.overlayRef.detach();
      ref.overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  private _attachOverlayContainer(overlay: OverlayRef): DtOverlayContainer {
    const containerPortal =
        new ComponentPortal(DtOverlayContainer, null);
    const containerRef = overlay.attach<DtOverlayContainer>(containerPortal);

    return containerRef.instance;
  }

  private _attachOverlayContent<T>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    container: DtOverlayContainer): void {

    if (componentOrTemplateRef instanceof TemplateRef) {
      container.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplateRef, null!));
    } else {
      container.attachComponentPortal<T>(
          new ComponentPortal(componentOrTemplateRef));
    }
  }

  // openHover(): void {
  //   this.hasBackdrop.next(false);
  //   this.panelOpen.next(true);
  //   console.log('open hover')
  // }

  // closeHover(): void {
  //   if(!this._stay) {
  //     this.panelOpen.next(false);
  //     this.hasBackdrop.next(false);
  //     this._overlayRef.detach();
  //     this._overlayRef.dispose();
  //     console.log('close hover')
  //   }
  // }

  // open(hasBackdrop: boolean): void {
  //   this._overlayRef.detach()
  //   this._setOpen(true, hasBackdrop);
  // }

  // stay(hasBackdrop: boolean, origin): void {
  //   this._stay = true;

  //   this.panelOpen.next(false);

  //   this._overlayRef.dispose();
  //   this._overlayRef.detach();

  //   console.log(this._overlayRef);

  //   this.hasBackdrop.next(true);
  //   this.panelOpen.next(true);

  //   this.create(origin);

  //   console.log('stay')
  // }

  // close(): void {
  //   // this._overlayRef = null;
  //   // this._overlayRef.detach()
  //   this.panelOpen.next(false);
  //   this.hasBackdrop.next(false);
  //   // this._setOpen(false, false);
  // }

  // private _setOpen(open: boolean, hasBackdrop: boolean): void {
  //   this.panelOpen.next(open);
  //   this.hasBackdrop.next(hasBackdrop);
  // }
}

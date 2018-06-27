import {
  ChangeDetectorRef,
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { DtOverlayTrigger} from './overlay-trigger';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { DtOverlayService } from './overlay';
import { BehaviorSubject, Subscription } from 'rxjs';

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
export class DtOverlayContainer {
  public _trigger: CdkOverlayOrigin;

  public isOpen: BehaviorSubject<boolean>;
  // public hasBackdrop: boolean;
  private _subscription;
  private _backdrop: Subscription;
  public hasBackdrop: boolean;

  constructor(private _dtOverlayService: DtOverlayService, private _changeDetectorRef: ChangeDetectorRef){
    this.isOpen = this._dtOverlayService.panelOpen;
    this._backdrop = _dtOverlayService.hasBackdrop.subscribe((value: boolean)=> {
      console.log('backdrop subscription', value)
      this.hasBackdrop = value;
      this._changeDetectorRef.markForCheck();
    });
  }

  public onAttach():void {
    console.log('attach')
  }

  public onDetach():void {
    console.log('detach')
  }

  public registerTrigger(trigger: DtOverlayTrigger): void {
    this._trigger = trigger;
    this._changeDetectorRef.markForCheck();
  }

  get trigger(): CdkOverlayOrigin | DtOverlayTrigger {
    return this._trigger;
  }

  close(): void {
    this._dtOverlayService.close()
  }
}

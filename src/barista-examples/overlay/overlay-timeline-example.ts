import { ElementRef, Component, Input, Optional, SkipSelf, NgZone, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { DtOverlayConfig } from '@dynatrace/angular-components/overlay';

// tslint:disable:no-magic-numbers

@Component({
  selector: 'dt-timeline',
  template: `
  <div class="timeline"
    tabindex="-1"
    #timeline
    [dtOverlay]="overlay"
    [dtOverlayConfig]="config"
    (mouseover)="_onMouseOver()"
    (mouseout)="_onMouseOut()">
    <ng-content></ng-content>
  </div>
  <ng-template #overlay><span>{{time | date: 'mm:ss'}}</span></ng-template>`,
  styles: [
    `:host() {
      display: block;
      padding-top: 4px;
      position: relative;
    }`,
    `.timeline {
      background-color: #EEDBFD;
      height: 14px;
      width: 100%;
    }`,
  ],
})
export class TimelineComponent {

  @ViewChild('timeline', { read: ElementRef, static: true }) timeline: ElementRef;

  config: DtOverlayConfig = {
    movementConstraint: 'xAxis',
    originY: 'edge',
  };

  time: Date;

  duration = 90;

  private _moveSub = Subscription.EMPTY;

  constructor(
    public elementRef: ElementRef,
    private _ngZone: NgZone) {
    const date = new Date();
    date.setMinutes(0);
    date.setSeconds(0);
    this.time = date;
  }

  _onMouseOver(): void {
    this._ngZone.runOutsideAngular(() => {
      this._moveSub = fromEvent(this.elementRef.nativeElement, 'mousemove')
      .pipe(
        map((ev: MouseEvent) => ev.offsetX),
        distinctUntilChanged(),
        map((offset) => this._calculateTime(offset))
      )
      .subscribe((offset) => {
        this._ngZone.run(() => {
          const minutes = Math.floor(offset / 60);
          const seconds = Math.floor(offset - (minutes * 60));
          const date = new Date();
          date.setSeconds(seconds);
          date.setMinutes(minutes);
          this.time = date;
         });
      });
    });
  }

  _onMouseOut(): void {
    this._moveSub.unsubscribe();
  }

  private _calculateTime(offset: number): number {
    const boundingBox = this.elementRef.nativeElement.getBoundingClientRect();
    const secPerPixel = this.duration / boundingBox.width;
    return Math.floor(secPerPixel * offset);
  }
}

@Component({
  selector: 'dt-timeline-point',
  template:
  `<div class="point" [dtOverlay]="overlay" [dtOverlayConfig]="config"
    [ngStyle]="{\'transform\': _translation }"></div>
  <ng-template #overlay>
    <p>Page Load: page/orange.jsf</p>
    <button dt-button>View highlight</button>
  </ng-template>`,
  styles: [
    `.point {
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: inline-block;
      background-color: #C396E0;
      border: 1px solid #FFFFFF;
      text-align: center;
      line-height: 20px;
      color: white;
      font-size: 14px;
      position: absolute;
      top: 0px;
    }
    p {
     margin-top: 0;
    }`,
  ],
})
export class TimelinePointComponent {

  config: DtOverlayConfig = {
    pinnable: true,
  };

  @Input()
  id: number;

  @Input()
  get position(): number { return this._position; }
  set position(value: number) { this._position = value; }

  private _position = 0;

  get _translation(): string {
    if (this._timeline) {
      const timelineRect = this._timeline.elementRef.nativeElement.getBoundingClientRect() as ClientRect;
      const translation = Math.max(0, (timelineRect.width / 100 * this.position) - 20);
      return `translate(${translation}px)`;
    }
    return 'translate(0)';
  }

  constructor(@Optional() @SkipSelf() private _timeline: TimelineComponent) {}
}

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
  <dt-timeline>
    <dt-timeline-point id="1" position="10"></dt-timeline-point>
    <dt-timeline-point id="2" position="30"></dt-timeline-point>
    <dt-timeline-point id="3" position="40"></dt-timeline-point>
  </dt-timeline>
  `,
})
export class OverlayTimelineExample {}

import { ElementRef, Component, Input, Optional, SkipSelf, NgZone, ChangeDetectorRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'dt-timeline',
  template: `
  <div class="timeline" [dtOverlay]="overlay" (mouseover)="_onMouseOver($event)" (mouseout)="_onMouseOut($event)">
    <ng-content></ng-content>
  </div>
  <ng-template #overlay>{{time | date: 'mm:ss'}}</ng-template>`,
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

  time: Date;

  duration = 90;

  private _moveSub = Subscription.EMPTY;

  constructor(public elementRef: ElementRef, private _ngZone: NgZone) {
    const date = new Date();
    date.setMinutes(0);
    date.setSeconds(0);
    this.time = date;
   }

  _onMouseOver(event: MouseEvent): void {
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

  _onMouseOut(event: MouseEvent): void {
    this._moveSub.unsubscribe();
  }

  private _calculateTime(offset: number): number {
    const boundingBox = this.elementRef.nativeElement.getBoundingClientRect();
    console.log(boundingBox.width);
    const secPerPixel = this.duration / boundingBox.width;
    console.log(Math.floor(secPerPixel * offset));
    return Math.floor(secPerPixel * offset);
  }
}

@Component({
  selector: 'dt-timeline-point',
  template:
  `<div class="point" [dtOverlay]="overlay" [ngStyle]="{\'transform\': _translation }"></div>
  <ng-template #overlay>
    <p>Page Load: page/orange.jsf</p>
    <a class="dt-link">Analyze</a>
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
    }`,
  ],
})
export class TimelinePointComponent {

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
  template: `
  <dt-timeline>
    <dt-timeline-point id="1" position="10"></dt-timeline-point>
    <dt-timeline-point id="2" position="30"></dt-timeline-point>
    <dt-timeline-point id="3" position="40"></dt-timeline-point>
  </dt-timeline>
  `,
})
export class TimelineOverlayExampleComponent {

}

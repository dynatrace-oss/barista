import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Inject,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { DT_TOAST_MESSAGE, DT_TOAST_FADE_TIME } from './toast';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';

@Component({
  moduleId: module.id,
  selector: 'dt-toast',
  exportAs: 'dtToast',
  template: '{{message}}',
  styleUrls: ['toast-ref.scss'],
  host: {
    'class': 'dt-toast',
    '[@fade]': '_animationState',
    '(@fade.done)': '_animationDone($event)',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      transition('* => enter', [
        animate(`${DT_TOAST_FADE_TIME}ms ease-in-out`, style({ opacity: 1 })),
      ]),
      transition('* => leave', [
        animate(`${DT_TOAST_FADE_TIME}ms ease-in-out`, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class DtToastRef {
  animationDone: EventEmitter<void> = new EventEmitter<void>();

  animationState: 'void' | 'enter' | 'leave' = 'enter';

  constructor(@Inject(DT_TOAST_MESSAGE) public message: string)  {}

  _animationDone(event: AnimationEvent): void {
    if (event.toState === 'leave') {
      this.animationDone.next();
      this.animationDone.complete();
    }
  }
}

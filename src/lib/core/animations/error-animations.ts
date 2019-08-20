import { animation, animate, style } from '@angular/animations';

export const DT_ERROR_ENTER_ANIMATION = animation([
  style({ opacity: 0, transform: 'scaleY(0)' }),
  animate('150ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
]);

export const DT_ERROR_ENTER_DELAYED_ANIMATION = animation([
  style({ opacity: 0, transform: 'scaleY(0)' }),
  animate(`250ms 150ms cubic-bezier(0.55, 0, 0.55, 0.2)`),
]);

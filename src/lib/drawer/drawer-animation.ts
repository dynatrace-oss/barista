import {
  animate,
  state,
  style,
  transition,
  trigger,
  AnimationTriggerMetadata,
} from '@angular/animations';

export const dtDrawerAnimation: AnimationTriggerMetadata[] = [
  trigger('transform', [
    state('open, open-instant', style({ transform: 'none' })),
    transition('closed => open-instant', animate('0ms')),
    transition(
      'closed <=> open, open-instant => closed',
      animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'),
    ),
  ]),
];

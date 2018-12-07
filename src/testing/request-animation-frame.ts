import { tick } from '@angular/core/testing';

export function tickRequestAnimationFrame(): void {
  tick(16);
}

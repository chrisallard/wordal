import { keyframes, style } from '@angular/animations';

export function slideInDown() {
  return keyframes([
    style({
      transform: 'translate3d(0, -100%, 0)',
      visibility: 'visible',
      offset: 0,
    }),
    style({
      transform: 'translate3d(0, 0, 0)',
      visibility: 'visible',
      offset: 1,
    }),
  ]);
}

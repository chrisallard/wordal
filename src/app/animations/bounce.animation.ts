import { keyframes, style } from '@angular/animations';

export function getBounceAnimation() {
  return keyframes([
    style({
      transform: 'translate3d(0, 0, 0)',
      offset: 0,
    }),
    style({
      transform: 'translate3d(0, 0, 0)',
      offset: 0.2,
    }),
    style({
      transform: 'translate3d(0, -30px, 0) scaleY(1.1)',
      offset: 0.4,
    }),
    style({
      transform: 'translate3d(0, -30px, 0) scaleY(1.1)',
      offset: 0.43,
    }),
    style({
      transform: 'translate3d(0, 0, 0)',
      offset: 0.53,
    }),
    style({
      transform: 'translate3d(0, -15px, 0) scaleY(1.05)',
      offset: 0.7,
    }),
    style({
      transform: 'translate3d(0, 0, 0) scaleY(0.95)',
      offset: 0.8,
    }),
    style({
      transform: 'translate3d(0, -4px, 0) scaleY(1.02)',
      offset: 0.9,
    }),
    style({
      transform: 'translate3d(0, 0, 0)',
      offset: 1,
    }),
  ]);
}

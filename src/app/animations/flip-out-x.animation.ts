import { animate, keyframes, style } from '@angular/animations';

export function flipOutX(duration: string = '500ms') {
  return animate(
    duration,
    keyframes([
      style({
        transform: 'perspective(400px)',
        offset: 0,
        opacity: 1,
      }),
      style({
        transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)',
        offset: 0.3,
        opacity: 1,
      }),
      style({
        transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)',
        offset: 1,
        opacity: 0,
      }),
    ])
  );
}

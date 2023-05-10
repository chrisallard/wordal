import {
  animate,
  keyframes,
  query,
  state,
  style,
  transition,
} from '@angular/animations';

export const navWidth = 300;

export const animState = {
  open: 'open',
  closed: 'closed',
};

export function toggleSideNav(navClass: string) {
  return [
    state(
      animState.closed,
      style({
        display: 'none',
      })
    ),
    state(
      animState.open,
      style({
        display: 'block',
      })
    ),
    transition(`${animState.open} => ${animState.closed}`, [
      query(
        `${navClass}`,
        animate(
          '200ms ease-in-out',
          keyframes([
            style([
              {
                left: 0,
                offset: 0,
              },
            ]),
            style([
              {
                left: `-${navWidth}px`,
                offset: 1,
              },
            ]),
          ])
        )
      ),
      query(
        '.overlay',
        animate(
          '250ms',
          style([
            {
              opacity: 0,
            },
          ])
        )
      ),
    ]),
    transition(`${animState.closed} => ${animState.open}`, [
      style({
        display: 'block',
      }),
      query(
        `${navClass}`,
        animate(
          '400ms ease-in-out',
          keyframes([
            style([
              {
                left: `-${navWidth}px`,
                offset: 0,
              },
            ]),
            style([
              {
                left: 0,
                offset: 1,
              },
            ]),
          ])
        )
      ),
    ]),
  ];
}

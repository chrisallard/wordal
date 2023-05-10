import {
  animate,
  keyframes,
  query,
  stagger,
  style,
  transition,
} from '@angular/animations';
import { IAnimimationTrans } from '@app/ts/interfaces';

export function getBoardClearAnimation(transStates: IAnimimationTrans) {
  return transition(`${transStates.fromState} => ${transStates.toState}`, [
    query(
      '.row',
      stagger(
        '100ms',
        animate(
          '300ms ease-in-out',
          keyframes([
            style({
              transform: 'translate3d(0, 0, 0)',
              offset: 0,
            }),
            style({
              transform: 'translate3d(10%, 0, 0)',
              offset: 0.5,
            }),
            style({
              transform: 'translate3d(0, 0, 0)',
              offset: 1,
            }),
          ])
        )
      )
    ),
  ]);
}

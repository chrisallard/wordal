import { animate, keyframes, style, transition } from '@angular/animations';
import { IAnimimationTrans } from '@app/ts/interfaces';

export const headShakeVibDuration = 300;
export const headShakeVibPause = 150;

export function getHeadShakeAnimation(
  transStates: IAnimimationTrans,
  duration = '750ms'
) {
  const headShake = {
    left: 'translate3d(-5px, 0, 0)',
    right: 'translate3d(5px, 0, 0)',
    neutral: 'translate3d(0, 0, 0)',
  };

  const headShakeKeyframes = [];

  for (let i = 0; i <= 10; i = i + 1) {
    let direction =
      i === 0 || i === 10
        ? headShake.neutral
        : i % 2 === 0
        ? headShake.right
        : headShake.left;

    headShakeKeyframes.push(
      style({
        transform: direction,
        offset: i / 10,
      })
    );
  }

  return transition(`${transStates.fromState} =>  ${transStates.toState}`, [
    animate(duration, keyframes(headShakeKeyframes)),
  ]);
}

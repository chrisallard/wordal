import { animate, state, style, transition } from '@angular/animations';
import { GuessFeedbackEnum, KeyColorEnum } from '@app/ts/enums';

const animKeyFillMetadata = '250ms 1600ms ease-in-out';
const animKeyDrainMetadata = '250ms ease-in-out';

export function getKeyColorAnimation() {
  return [
    state(
      GuessFeedbackEnum.Unused,
      style({
        background: KeyColorEnum.UnusedBgColor,
        color: KeyColorEnum.UnusedColor,
      })
    ),
    state(
      GuessFeedbackEnum.Correct,
      style({
        background: KeyColorEnum.CorrectBgColor,
        color: KeyColorEnum.UsedColor,
      })
    ),
    state(
      GuessFeedbackEnum.Absent,
      style({
        background: KeyColorEnum.AbsentBgColor,
        color: KeyColorEnum.UsedColor,
      })
    ),
    state(
      GuessFeedbackEnum.Present,
      style({
        background: KeyColorEnum.PresentBgColor,
        color: KeyColorEnum.UsedColor,
      })
    ),
    transition(
      `${GuessFeedbackEnum.Present} => ${GuessFeedbackEnum.Correct}`,

      animate(
        animKeyFillMetadata,
        style({
          background: KeyColorEnum.CorrectBgColor,
          color: KeyColorEnum.UsedColor,
        })
      )
    ),
    transition(
      `${GuessFeedbackEnum.Unused} => ${GuessFeedbackEnum.Correct}`,

      animate(
        animKeyFillMetadata,
        style({
          background: KeyColorEnum.CorrectBgColor,
          color: KeyColorEnum.UsedColor,
        })
      )
    ),
    transition(
      `${GuessFeedbackEnum.Unused} => ${GuessFeedbackEnum.Absent}`,
      animate(
        animKeyFillMetadata,
        style({
          background: KeyColorEnum.AbsentBgColor,
          color: KeyColorEnum.UsedColor,
        })
      )
    ),
    transition(
      `${GuessFeedbackEnum.Unused} => ${GuessFeedbackEnum.Present}`,

      animate(
        animKeyFillMetadata,
        style({
          background: KeyColorEnum.PresentBgColor,
          color: KeyColorEnum.UsedColor,
        })
      )
    ),
    transition(
      `${GuessFeedbackEnum.Correct} => ${GuessFeedbackEnum.Unused}`,

      animate(
        animKeyDrainMetadata,
        style({
          background: KeyColorEnum.UnusedBgColor,
          color: KeyColorEnum.UnusedColor,
        })
      )
    ),
    transition(
      `${GuessFeedbackEnum.Absent} => ${GuessFeedbackEnum.Unused}`,

      animate(
        animKeyDrainMetadata,
        style({
          background: KeyColorEnum.UnusedBgColor,
          color: KeyColorEnum.UnusedColor,
        })
      )
    ),
    transition(
      `${GuessFeedbackEnum.Present} => ${GuessFeedbackEnum.Unused}`,

      animate(
        animKeyDrainMetadata,
        style({
          background: KeyColorEnum.UnusedBgColor,
          color: KeyColorEnum.UnusedColor,
        })
      )
    ),
  ];
}

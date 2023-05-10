import { GuessFeedbackEnum } from '@app/ts/enums';
import { IGuess } from '@app/ts/interfaces';
import { getGuessState } from '@utils/get-guess-state.utils';

describe('getGuessState', () => {
  it('should return a well structured response', () => {
    const myGuess = 'spoil';
    const solution = 'loops';

    const mockResponse: IGuess[] = [
      {
        isCorrect: false,
        isPresent: true,
        state: GuessFeedbackEnum.Present,
        value: 's',
      },
      {
        isCorrect: false,
        isPresent: true,
        state: GuessFeedbackEnum.Present,
        value: 'p',
      },
      {
        isCorrect: true,
        isPresent: true,
        state: GuessFeedbackEnum.Correct,
        value: 'o',
      },
      {
        isCorrect: false,
        isPresent: false,
        state: GuessFeedbackEnum.Absent,
        value: 'i',
      },
      {
        isCorrect: false,
        isPresent: true,
        state: GuessFeedbackEnum.Present,
        value: 'l',
      },
    ];

    const guess = getGuessState(myGuess, solution);
    expect(guess).toEqual(mockResponse);
  });
});

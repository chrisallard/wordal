import { GuessFeedbackEnum } from '@app/ts/enums';
import { IGuess } from '@app/ts/interfaces';
import { removeFalsePositives } from '@utils/remove-false-positives.utils';

describe('removeFalsePositives', () => {
  it('should return deduped guesses', () => {
    const solution = 'baton';
    /*
        solution 'baton' only has one letter 'a' but the guess 'abate' contains two
        only one of these can be either correct or present in the puzzle
        mockGuesses[0] === guess to mark as wrong/absent
        mockGuesses[2] === guess to leave unmodified
    */
    const mockGuesses: IGuess[] = [
      {
        isCorrect: false,
        isPresent: true,
        state: GuessFeedbackEnum.Present,
        value: 'a',
      },
      {
        isCorrect: false,
        isPresent: true,
        state: GuessFeedbackEnum.Present,
        value: 'b',
      },
      {
        isCorrect: false,
        isPresent: true,
        state: GuessFeedbackEnum.Present,
        value: 'a',
      },
      {
        isCorrect: false,
        isPresent: true,
        state: GuessFeedbackEnum.Present,
        value: 't',
      },
      {
        isCorrect: false,
        isPresent: false,
        state: GuessFeedbackEnum.Absent,
        value: 'e',
      },
    ];

    const result = removeFalsePositives(mockGuesses, solution);

    expect(result[0].isPresent).toBeFalse();
    expect(result[0].state).toEqual(GuessFeedbackEnum.Absent);
    expect(result[2]).toEqual(mockGuesses[2]);
  });
});

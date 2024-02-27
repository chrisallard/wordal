import { IRound } from '@app/ts/interfaces';
import { undoLastGuess } from '@utils/undo-last-guess.utils';

describe('undoLastGuess', () => {
  let mockRound: IRound;
  let result: IRound;

  beforeEach(() => {
    mockRound = {
      guesses: [
        {
          isActive: false,
        },
        {
          isActive: false,
        },
        {
          isActive: false,
        },
        {
          isActive: false,
        },
        {
          isActive: false,
        },
      ],
      isActiveRound: false,
      isInvalidWord: false,
      isRoundComplete: false,
      isWinningRound: false,
      letters: ['a', 'b', 'a', 't', 'e'],
    };

    result = undoLastGuess(mockRound);
  });

  it('should return current guessed letters minus one', () => {
    expect(result.letters.length).toEqual(4);
  });

  it('should set the first unused guess as active', () => {
    expect(result.guesses[result.guesses.length - 1].isActive).toBeTrue();
  });
});

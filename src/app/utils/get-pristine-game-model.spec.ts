import { IRound } from '@app/ts/interfaces';
import { getPristineGameModel } from '@utils/get-pristine-game-model.utils';

describe('getPristineGameModel', () => {
  it('should return a well structured model', () => {
    const mockModel: IRound[] = [
      {
        guesses: [
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
        ],
        isActiveRound: false,
        isInvalidWord: false,
        isRoundComplete: false,
        isWinningRound: false,
        letters: [],
      },
      {
        guesses: [
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
        ],
        isActiveRound: false,
        isInvalidWord: false,
        isRoundComplete: false,
        isWinningRound: false,
        letters: [],
      },
      {
        guesses: [
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
        ],
        isActiveRound: false,
        isInvalidWord: false,
        isRoundComplete: false,
        isWinningRound: false,
        letters: [],
      },
      {
        guesses: [
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
        ],
        isActiveRound: false,
        isInvalidWord: false,
        isRoundComplete: false,
        isWinningRound: false,
        letters: [],
      },
      {
        guesses: [
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
        ],
        isActiveRound: false,
        isInvalidWord: false,
        isRoundComplete: false,
        isWinningRound: false,
        letters: [],
      },
      {
        guesses: [
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
          {
            isActive: false,
            hasRevealedHint: false,
          },
        ],
        isActiveRound: false,
        isInvalidWord: false,
        isRoundComplete: false,
        isWinningRound: false,
        letters: [],
      },
    ];

    const gameModel = getPristineGameModel();
    expect(gameModel).toEqual(mockModel);
  });
});

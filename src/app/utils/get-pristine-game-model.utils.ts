import { GameParamsEnum } from '@app/ts/enums';
import { IRound } from '@app/ts/interfaces';

export function getPristineGameModel(): IRound[] {
  return Array.from({ length: GameParamsEnum.NumRounds }, () => {
    const guesses = [];

    for (let i = 0; i < GameParamsEnum.NumGuesses; i = i + 1) {
      guesses.push({
        isActive: false,
        hasRevealedHint: false,
      });
    }

    return {
      guesses,
      isActiveRound: false,
      isInvalidWord: false,
      isRoundComplete: false,
      isWinningRound: false,
      letters: [],
    };
  });
}

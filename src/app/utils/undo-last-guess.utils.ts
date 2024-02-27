import { GameParamsEnum } from '@app/ts/enums';
import { IRound } from '@app/ts/interfaces';

export function undoLastGuess(currentRound: IRound) {
  const round = { ...currentRound };
  const numEnteredLetters = round.letters.length;
  const lastEnteredLetterIndex = numEnteredLetters - 1;
  const numLettersToRemove = 1;

  // removes last guessed letter
  round.letters.splice(lastEnteredLetterIndex, numLettersToRemove);

  // if we have letters, we need to manage the in-tile cursor placement
  if (numEnteredLetters > 0) {
    if (numEnteredLetters < GameParamsEnum.NumGuesses) {
      // removes cursor from the tile immediatley following the first empty tile
      round.guesses[numEnteredLetters].isActive = false;
    }

    // applies cursor to first empty tile
    round.guesses[lastEnteredLetterIndex] = {
      ...round.guesses[lastEnteredLetterIndex],
      isActive: true,
    };
  }

  return round;
}

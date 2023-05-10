import { GuessFeedbackEnum } from '@app/ts/enums';
import { IGuess } from '@app/ts/interfaces';
/**
 * Marks duplicate letters absent if their total is greater than what is in the puzzle.
 */
export function removeFalsePositives(
  guesses: IGuess[],
  solution: string
): IGuess[] {
  guesses.forEach((guess) => {
    const guessedLetter = guess.value;

    let numInPuzzle = [...solution].filter(
      (letter) => letter === guessedLetter
    ).length;

    if (numInPuzzle > 0) {
      const numCorrectlyPlaced = guesses.filter(
        (guess) => guess.value === guessedLetter && guess.isCorrect
      ).length;

      numInPuzzle = numInPuzzle - numCorrectlyPlaced;

      if (guess.isPresent && !guess.isCorrect) {
        const numMatches = guesses.filter(
          (guess) =>
            guess.value === guessedLetter && guess.isPresent && !guess.isCorrect
        );

        if (numMatches.length > numInPuzzle) {
          guess.isPresent = false;
          guess.state = GuessFeedbackEnum.Absent;
        }
      }
    }
  });

  return [...guesses];
}

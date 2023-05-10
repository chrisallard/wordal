import { GameParamsEnum, GuessFeedbackEnum } from '@app/ts/enums';
import { IGuess } from '@app/ts/interfaces';
import { removeFalsePositives } from '@utils/remove-false-positives.utils';

export function getGuessState(guess: string, solution: string): IGuess[] {
  const guesses: IGuess[] = [];

  const letters = [...guess];

  if (letters.length !== GameParamsEnum.NumGuesses) {
    console.error(
      `Expected ${GameParamsEnum.NumGuesses} letters, but got ${letters.length}`
    );
    return [];
  }

  for (let i = 0; i < solution.length; i = i + 1) {
    const isCorrect = letters[i] === solution[i];
    const isPresent = solution.includes(letters[i]);

    guesses.push({
      isCorrect,
      isPresent,
      state: isCorrect
        ? GuessFeedbackEnum.Correct
        : isPresent
        ? GuessFeedbackEnum.Present
        : GuessFeedbackEnum.Absent,
      value: letters[i],
    });
  }

  return removeFalsePositives(guesses, solution);
}

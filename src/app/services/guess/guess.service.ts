import { Injectable } from '@angular/core';
import { GuessFeedbackEnum, SpecialKeysEnum } from '@app/ts/enums';
import { IGuess, IKeyBoard } from '@app/ts/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GuessService {
  private _keyboard = this._getModel();
  private _guess$ = new BehaviorSubject<IKeyBoard>(this._keyboard);
  guess$ = this._guess$.asObservable();

  updateGuess(updates: IGuess[]) {
    if (updates && updates.length) {
      updates.forEach((update: IGuess) => {
        const guess = update.value;

        if (guess) {
          // once the letter is correct we keep it in that state until the end of the game
          if (!this._keyboard[guess].isCorrect) {
            this._keyboard[guess] = { ...this._keyboard[guess], ...update };
          }
        }
      });
    }

    this._guess$.next(this._keyboard);
  }

  reset() {
    this._keyboard = { ...this._getModel() };
    this._guess$.next(this._keyboard);
  }

  private _getModel() {
    const model: IKeyBoard = {
      q: { row: 1 },
      w: { row: 1 },
      e: { row: 1 },
      r: { row: 1 },
      t: { row: 1 },
      y: { row: 1 },
      u: { row: 1 },
      i: { row: 1 },
      o: { row: 1 },
      p: { row: 1 },
      a: { row: 2 },
      s: { row: 2 },
      d: { row: 2 },
      f: { row: 2 },
      g: { row: 2 },
      h: { row: 2 },
      j: { row: 2 },
      k: { row: 2 },
      l: { row: 2 },
      [SpecialKeysEnum.Refresh]: {
        row: 3,
        label: SpecialKeysEnum.Refresh_Label,
      },
      z: { row: 3 },
      x: { row: 3 },
      c: { row: 3 },
      v: { row: 3 },
      b: { row: 3 },
      n: { row: 3 },
      m: { row: 3 },
      [SpecialKeysEnum.Backspace]: { row: 3, label: SpecialKeysEnum.Backspace },
      [SpecialKeysEnum.Enter]: {
        row: 4,
        alias: SpecialKeysEnum.Submit,
      },
    };

    Object.keys(model).forEach((letter) => {
      model[letter] = {
        isCorrect: false,
        isPresent: false,
        state: GuessFeedbackEnum.Unused,
        value: letter,
        ...model[letter],
      };
    });

    return model;
  }
}

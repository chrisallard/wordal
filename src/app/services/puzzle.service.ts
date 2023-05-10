import { Injectable } from '@angular/core';
import { puzzleBank } from '@assets/puzzle-bank';
import { StorageService } from '@services/storage/storage.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PuzzleService {
  constructor(private _storageSvc: StorageService) {}

  getPuzzle(): Observable<string> {
    return of(this._getUnsolvedPuzzle());
  }

  private _getUnsolvedPuzzle(): string {
    const getRandomPuzzle = (): string =>
      puzzleBank[Math.floor(Math.random() * puzzleBank.length)];

    let puzzle = getRandomPuzzle();
    const storedData = this._storageSvc.getLocalStorageData();

    if (storedData) {
      let completedPuzzles = storedData.completedPuzzles || [];
      const areAllPuzzlesSolved = completedPuzzles.length === puzzleBank.length;
      if (areAllPuzzlesSolved) {
        completedPuzzles = [];
        this._storageSvc.setLocalStorageData({
          ...storedData,
          completedPuzzles,
        });
      }

      let isUnsolvedPuzzle = false;

      while (!isUnsolvedPuzzle) {
        isUnsolvedPuzzle = !completedPuzzles.includes(puzzle);

        if (!isUnsolvedPuzzle) {
          puzzle = getRandomPuzzle();
        }
      }

      return puzzle;
    }
    return puzzle;
  }
}

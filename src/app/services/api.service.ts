import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DICTIONARY_API_URL, LOCAL_STORAGE_KEY } from '@app/app.config';
import { solutionBank } from '@assets/solution-bank';
import { DictionaryEntry } from '@services/api';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private _http: HttpClient) {}

  getPuzzle() {
    return of(this._getUnsolvedPuzzle());
  }

  verifyWord(word: string): Observable<DictionaryEntry> {
    return this._http.get<DictionaryEntry>(`${DICTIONARY_API_URL}${word}`);
  }

  private _getUnsolvedPuzzle() {
    // method to generate a normalized, random word from our solution bank
    const getSolution = () =>
      solutionBank[
        Math.floor(Math.random() * solutionBank.length)
      ].toUpperCase();

    // puzzle solution candidate
    let solution = getSolution();

    // what puzzles have already been solved (from local storage)?
    const prevSolutions = localStorage.getItem(LOCAL_STORAGE_KEY);

    // do we have previous game winners?
    if (prevSolutions) {
      // get array of the prev solved solutions
      let solves = JSON.parse(prevSolutions);

      // have all puzzles have been solved?
      if (solves.length === solutionBank.length) {
        // clear local storage to denote all solutions as available
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        solves = [];
      }

      // set trigger
      let isNewSolution = false;

      // keep generating a new solution until it does not match a previous solve
      while (!isNewSolution) {
        isNewSolution = !solves.includes(solution);

        // solution found in solved list
        if (!isNewSolution) {
          // generate new random puzzle solution
          solution = getSolution();
        }
      }

      return solution;
    }
    return solution;
  }
}

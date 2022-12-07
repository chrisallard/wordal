import {
  animate,
  animateChild,
  keyframes,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LOCAL_STORAGE_KEY, ROUND_TOTAL } from '@app/app.config';
import { ApiService } from '@services/api.service';
import { ConfettiService } from '@services/confetti.service';

interface GuessesInterface {
  letter: null | string;
  isCorrectlyPlaced: boolean;
  isInAnswer: boolean;
  isNextTurn: null | boolean;
}

interface RoundInterface {
  guesses: GuessesInterface[];
  hasRoundStarted: boolean;
  isRoundComplete: boolean;
  isPuzzleIncomplete: boolean;
  isPuzzleSolved: boolean;
  isWordInvalid: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('roundComplete', [
      transition(
        '* => completed',
        query('.flip-tile-inner', [
          stagger('100ms', [
            animate(
              '500ms',
              style({
                transform: 'rotateX(-180deg)',
              })
            ),
          ]),
        ])
      ),
      transition('* => solved', [
        query('.flip-tile-inner', [
          stagger('100ms', [
            animate(
              '500ms',
              style({
                transform: 'rotateX(-180deg)',
              })
            ),
          ]),
        ]),
        query('.letter', [
          stagger('100ms', [
            animate(
              '1000ms',
              keyframes([
                style({
                  'animation-timing-function':
                    'cubic-bezier(0.215, 0.61, 0.355, 1)',
                  transform: 'translate3d(0, 0, 0)',
                  offset: 0,
                }),
                style({
                  'animation-timing-function':
                    'cubic-bezier(0.215, 0.61, 0.355, 1)',
                  transform: 'translate3d(0, 0, 0)',
                  offset: 0.2,
                }),
                style({
                  'animation-timing-function':
                    'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
                  transform: 'translate3d(0, -30px, 0) scaleY(1.1)',
                  offset: 0.4,
                }),
                style({
                  'animation-timing-function':
                    'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
                  transform: 'translate3d(0, -30px, 0) scaleY(1.1)',
                  offset: 0.43,
                }),
                style({
                  'animation-timing-function':
                    'cubic-bezier(0.215, 0.61, 0.355, 1)',
                  transform: 'translate3d(0, 0, 0)',
                  offset: 0.53,
                }),

                style({
                  'animation-timing-function':
                    'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
                  transform: 'translate3d(0, -15px, 0) scaleY(1.05)',
                  offset: 0.7,
                }),
                style({
                  'transition-timing-function':
                    'cubic-bezier(0.215, 0.61, 0.355, 1)',
                  transform: 'translate3d(0, 0, 0) scaleY(0.95)',
                  offset: 0.8,
                }),
                style({
                  transform: 'translate3d(0, -4px, 0) scaleY(1.02)',
                  offset: 0.9,
                }),
                style({
                  'animation-timing-function':
                    'cubic-bezier(0.215, 0.61, 0.355, 1)',
                  transform: 'translate3d(0, 0, 0)',
                  offset: 1,
                }),
              ])
            ),
          ]),
        ]),
      ]),
      transition('* => *', [query('@flipTile', animateChild())]),
    ]),
    trigger('flipTile', [
      // this is needed to keep the animation in the forwards position
      state(
        'flipped',
        style({
          transform: 'rotateX(-180deg)',
        })
      ),
      transition('* => flipped', [
        style({
          transform: 'rotateX(-180deg)',
        }),
      ]),
    ]),
    trigger('newGame', [
      state('true', style({ 'animation-delay': '4s' })), //game won
      state('false', style({ 'animation-delay': '1.2s' })), // game lost
      transition(':leave', [query('@newGameBtn', animateChild())]),
    ]),
    trigger('newGameBtn', [
      transition(':leave', [
        animate(
          '750ms',
          keyframes([
            style({
              transform: 'translate3d(20px, 0, 0) scaleX(0.9)',
              offset: 0.2,
            }),
            style({
              opacity: 0,
              transform: 'translate3d(-2000px, 0, 0) scaleX(2)',
              offset: 1,
            }),
          ])
        ),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  private _currentRound!: RoundInterface;
  private _currentRoundIndex = 0;
  private _numRounds = ROUND_TOTAL;
  private _lettersCopy: string[] = [];
  private _letters: string[] = [];
  private _solution: string = '';
  private _tileSet = new Set();

  game!: RoundInterface[];
  gameWon: boolean = false;
  gameOver: boolean = false;
  playedTiles: any;

  constructor(
    private _api: ApiService,
    private _confettiService: ConfettiService
  ) {}

  ngOnInit(): void {
    this.newGame();
  }

  updateGuess(key: string): void {
    key = key.toUpperCase();

    if (!this.gameWon && !this.gameOver) {
      const guesses = this._currentRound.guesses;

      // find the index of the first unfilled letter in active round
      const nextGuessIndex = guesses.findIndex((x) => x.letter === null);

      // solve attempt
      if (key === 'ENTER') {
        // no unfilled letters remain (round over)
        if (nextGuessIndex === -1) {
          // reset flags
          this._currentRound.isWordInvalid = false;

          // assemble solution from letter guesses
          const solution = this._currentRound.guesses
            .map((choice) => choice.letter)
            .toString()
            .replace(/,/g, '');

          // is the solution in the dictionary (an actual word)
          this._api.verifyWord(solution).subscribe({
            next: () => {
              // word is in dictionary
              this._roundOver();
            },
            error: (err: HttpErrorResponse) => {
              // not found in dicitionary
              if (err.status === 404) {
                // trigger UI animation
                this._currentRound.isWordInvalid = true;
              }
              // TODO: handle other errors through an error servcie
            },
          });
        } else {
          // not enough letters
          this._currentRound.isPuzzleIncomplete = true;

          // anguler misses this change, so temp fix is to wrap it in a setTimout
          setTimeout(() => {
            this._currentRound.isPuzzleIncomplete = false;
          }, 500);
        }
      }

      if (key === 'BACKSPACE' && nextGuessIndex !== 0) {
        this.handleBackspace();
      }

      // pressed key needs to be a letter and there needs to be guesses remaining
      if (key.length === 1 && /[a-zA-Z]/.test(key) && nextGuessIndex !== -1) {
        const currentChoice = guesses[nextGuessIndex];
        this._currentRound.hasRoundStarted = true;
        currentChoice.letter = key;

        if (this._lettersCopy.includes(key)) {
          // // // console.log(`${key} is in solution`);
          // letter is in puzzle
          const spentLetterPos = this._lettersCopy.lastIndexOf(key);
          if (spentLetterPos !== -1) {
            this._lettersCopy.splice(spentLetterPos, 1);
            currentChoice.isInAnswer = true;
          }
        }

        if (this._letters[nextGuessIndex] === key) {
          // correcrt letter in the corrrect place
          currentChoice.isCorrectlyPlaced = true;
          // // // console.log(`${key} is correctly placed`);
          // if this letter is now gone from the puzzle
          if (this._lettersCopy.lastIndexOf(key) === -1) {
            // look for previously misplaced letters
            for (let k = 0; k < guesses.length; k = k + 1) {
              const guess = guesses[k];
              if (guess.letter === key && guess.isInAnswer) {
                guess.isInAnswer = false;
              }
            }
          } else {
            // more than one of the same letter in puzzle
            console.log(
              `There is more than one  of the letter ${key} in the solution`
            );
          }
        }

        currentChoice.isNextTurn = false;

        this._tileSet.add(
          `${currentChoice.letter}:` +
            `${currentChoice.isCorrectlyPlaced ? 1 : 0}:` +
            `${currentChoice.isInAnswer ? 1 : 0}`
        );

        const nextGuess = guesses[nextGuessIndex + 1];
        if (nextGuess) {
          nextGuess.isNextTurn = true;
        }
      }
    }
  }

  newGame(): void {
    this.gameOver = false;
    this.gameWon = false;
    this.playedTiles = [];
    this._tileSet.clear();

    // fetch a word and create the model
    this._api.getPuzzle().subscribe((word: any) => {
      this._solution = word;
      this._letters = [...word];
      this._lettersCopy = [...this._solution];

      console.log(this._solution);

      const solutionLen = this._letters.length;
      const rounds = [];

      for (let i = 0; i < this._numRounds; i = i + 1) {
        const guesses = [];
        for (let j = 0; j < solutionLen; j = j + 1) {
          guesses.push({
            letter: null,
            isCorrectlyPlaced: false,
            isInAnswer: false,
            isNextTurn: j === 0 && i === 0 ? true : false,
          });
        }
        rounds.push({
          guesses,
          hasRoundStarted: false,
          isRoundComplete: false,
          isPuzzleIncomplete: false,
          isPuzzleSolved: false,
          isWordInvalid: false,
        });
      }

      this.game = rounds;
      this._currentRoundIndex = 0;
      this._currentRound = this.game[this._currentRoundIndex];
    });
  }

  private _roundOver(): void {
    this._currentRound.isRoundComplete = true;

    const incorrectChoice = this._currentRound.guesses.findIndex(
      (letter) => letter.isCorrectlyPlaced === false
    );

    this._currentRound.isPuzzleSolved = incorrectChoice === -1;

    if (this._currentRound.isPuzzleSolved) {
      // add solved words to local storage so they aren't choosen regularly
      const prevSolvedWords = localStorage.getItem(LOCAL_STORAGE_KEY);

      // this isn't their first win - good for them!
      if (prevSolvedWords) {
        // add new solution to previous ones
        const updatedWords = [this._solution, ...JSON.parse(prevSolvedWords)];
        // update local storage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedWords));
      } else {
        // first win - create the storage
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify([this._solution])
        );
      }

      // queue the fireworks
      this.gameWon = true;
      this.gameOver = true;
      this.celebrate();
    }

    this._currentRoundIndex += 1;

    if (
      !this._currentRound.isPuzzleSolved &&
      this._currentRoundIndex < this._numRounds
    ) {
      this._currentRound = this.game[this._currentRoundIndex];

      this._currentRound.guesses[0].isNextTurn = true;
      this._lettersCopy = [...this._letters];
    }

    this.playedTiles = [...this._tileSet];
    this._tileSet.clear();

    if (this._currentRoundIndex === this._numRounds) {
      this.gameOver = true;
    }
  }

  handleBackspace(): void {
    // @ts-ignore
    const lastAnswerIndex = this._currentRound.guesses.findLastIndex(
      // @ts-ignore
      (x) => x.letter !== null
    );
    const lastGuess = this._currentRound.guesses[lastAnswerIndex];

    this._tileSet.delete(
      `${lastGuess.letter}:` +
        `${lastGuess.isCorrectlyPlaced ? 1 : 0}:` +
        `${lastGuess.isInAnswer ? 1 : 0}`
    );
    this._currentRound.guesses[lastAnswerIndex].letter = null;

    const prevGuess = this._currentRound.guesses[lastAnswerIndex];
    const nextGuess = this._currentRound.guesses[lastAnswerIndex + 1];

    if (nextGuess) {
      nextGuess.isNextTurn = false;
    }

    if (prevGuess) {
      prevGuess.isNextTurn = true;
    }

    // return spent letter to the available pool
    this._lettersCopy[lastAnswerIndex] = this._solution[lastAnswerIndex];
  }

  private celebrate() {
    setTimeout(() => {
      this._confettiService.cannon();
    }, 750);
  }
}

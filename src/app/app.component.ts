import {
  animateChild,
  AnimationEvent,
  query,
  stagger,
  transition,
  trigger,
} from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationRef, Component, HostListener, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { getBoardClearAnimation } from '@app/animations/board-clear.animation';
import { flipOutX } from '@app/animations/flip-out-x.animation';
import {
  getHeadShakeAnimation,
  headShakeVibDuration,
  headShakeVibPause,
} from '@app/animations/head-shake.animation';
import { API_TIMEOUT_DURATION } from '@app/config/app.config';
import { GuessService } from '@app/services/guess/guess.service';
import { PuzzleService } from '@app/services/puzzle.service';
import {
  GameParamsEnum,
  ModalNameEnum,
  NewGamePromptEnum,
  RoundFinishTypeEnum,
  SpecialKeysEnum,
  ToastrMessagesEnum,
} from '@app/ts/enums';
import {
  IDiscoveredLetters,
  IRound,
  IStoredSettings,
} from '@app/ts/interfaces';
import { calcElapsedTime } from '@app/utils/calc-elapsed-time.utils';
import { GoogleAnalyticsService } from '@services/analytics/google-analytics.service';
import { MakeToast } from '@services/make-toast/make-toast.service';
import { ModalService } from '@services/modal/modal.service';
import { ProgressiveWebApp } from '@services/progressive-web-app/progressive-web-app.service';
import { StorageService } from '@services/storage/storage.service';
import { VerifyWordService } from '@services/verify-word/verify-word.service';
import { getGuessState } from '@utils/get-guess-state.utils';
import { getPristineGameModel } from '@utils/get-pristine-game-model.utils';
import { getSuccessMessage } from '@utils/get-success-msg.utils';
import { isModalOpen } from '@utils/is-modal-open.utils';
import { undoLastGuess } from '@utils/undo-last-guess.utils';
import { vibrateDevice } from '@utils/vibrate-device.utils';
import { concat, interval, Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('boardClear', [
      getBoardClearAnimation({ fromState: 'false', toState: 'true' }),
    ]),
    trigger('roundComplete', [
      transition('* => *', [
        query('@flipTileInner', stagger('300ms', animateChild())),
        query('@flipTile', stagger('100ms', animateChild({ delay: 250 }))),
      ]),
    ]),
    trigger('headShake', [
      getHeadShakeAnimation({ fromState: 'false', toState: 'true' }),
    ]),
    trigger('indicator', [
      transition(':leave', [query('.hard-mode-indicator', flipOutX())]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  private _currentRoundIndex: number = 0;
  private _gameDuration!: string;
  private _gameStartTime!: number;
  private _headShakeVibPattern = [
    headShakeVibDuration,
    headShakeVibDuration,
    headShakeVibPause,
  ];
  private _lettersDiscovered: IDiscoveredLetters[] = [];
  private _isFastestTime: boolean = false;
  private _numLastDonationGame: number = 0;
  private _numGuessesInRound: number = GameParamsEnum.NumGuesses;
  private _numHintsRemaining: number = GameParamsEnum.NumHints;
  private _numPlayedAllTime: number = 0;
  private _numPlayedSession: number = 0;
  private _numRounds: number = GameParamsEnum.NumRounds;
  private _solution: string = '';

  hasWonGame: boolean = false;
  haveTilesBounced: boolean = false;
  isBoardLocked: boolean = true;
  isNavOpen: boolean = false;
  isNewVersionAvailable: boolean = false;
  isStartingNewGame: boolean = true;
  isVersionUpdated: boolean = false;
  roundFinish = RoundFinishTypeEnum;
  rounds: IRound[] = getPristineGameModel();
  settings!: IStoredSettings | null;
  shouldClearBoard: boolean = false;

  constructor(
    private _analyticsSvc: GoogleAnalyticsService,
    private _appRef: ApplicationRef,
    private _guessSvc: GuessService,
    private _modalSvc: ModalService,
    private _puzzleSvc: PuzzleService,
    private _pwa: ProgressiveWebApp,
    private _storageSvc: StorageService,
    private _swUpdate: SwUpdate,
    private _toastr: MakeToast,
    private _verifyWordSvc: VerifyWordService
  ) {
    if (this._swUpdate.isEnabled) {
      // Allow the app to stabilize first, before  polling for updates with `interval()`.
      const appIsStable$ = _appRef.isStable.pipe(
        first((isStable) => isStable === true)
      );

      const hours = 6;
      const milliSecInMin = 3600;
      const millisecond = 1000;

      const everySixHours$ = interval(hours * milliSecInMin * millisecond);
      const everySixHoursOnceAppIsStable$ = concat(
        appIsStable$,
        everySixHours$
      );

      everySixHoursOnceAppIsStable$.subscribe(async () => {
        try {
          const isUpdateAvailable = await _swUpdate.checkForUpdate();

          if (isUpdateAvailable) {
            this.isVersionUpdated = false;
            this.isNewVersionAvailable = true;
          }
        } catch (error) {
          console.error('Failed to check for updates: ', error);
        }
      });
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(): void {
    this._analyticsSvc.gaCaptureAnalyticsEvent('exiting_site', {
      num_session_plays: this._numPlayedSession,
    });
  }

  handleKeyPress(key: string): void {
    if (this.isBoardLocked) {
      return;
    }

    if (this.isStartingNewGame) {
      this.isStartingNewGame = false;
    }

    const vibrationDuration = 10;
    vibrateDevice(vibrationDuration);

    if (key === SpecialKeysEnum.Refresh) {
      this._confirmNewGameRequest();
      return;
    }

    const activeRound = this.rounds[this._currentRoundIndex];

    if (key === SpecialKeysEnum.Backspace) {
      undoLastGuess(activeRound);
      return;
    }

    const letters = activeRound.letters;
    const isUnfinished = letters.length < GameParamsEnum.NumGuesses;

    const isSubmittingGuess =
      key === SpecialKeysEnum.Submit || key == SpecialKeysEnum.Enter;

    if (isSubmittingGuess && !isModalOpen()) {
      if (isUnfinished) {
        activeRound.isInvalidWord = true;

        vibrateDevice(this._headShakeVibPattern);

        this._toastr.makeToast({
          message: ToastrMessagesEnum.TooFew,
        });

        return;
      }

      if (this.settings?.hardMode && this._lettersDiscovered.length) {
        const prevFoundLetters: Array<any> = this._lettersDiscovered.map(
          (hint) => {
            return hint.value;
          }
        );

        if (!prevFoundLetters.every((letter) => letters.includes(letter))) {
          const missingLetters = prevFoundLetters.filter(
            (letter: string) => !letters.includes(letter)
          );
          this._toastr.makeToast({
            message: `You must use: ${missingLetters.join(', ').toUpperCase()}`,
          });
          return;
        }

        const correctLetters = this._lettersDiscovered.filter(
          (letter) => letter.isCorrect
        );
        if (correctLetters) {
          for (let i = 0; i < correctLetters.length; i = i + 1) {
            if (letters[correctLetters[i].index] !== correctLetters[i].value) {
              const correctLetter = correctLetters[i].value
                ? correctLetters[i].value?.toUpperCase()
                : '';

              this._toastr.makeToast({
                message: `${correctLetter} must be in the ${correctLetters[i].nonZeroIndex} spot.`,
              });
              return;
            }
          }
        }
      }

      const guessedWord = letters.join('');
      this._verifyWord(guessedWord);

      return;
    }

    const isValidLetter = key.length === 1 && /[a-zA-Z]/.test(key);
    if (isValidLetter && isUnfinished) {
      const currentTile = activeRound.guesses[letters.length];
      currentTile.isActive = false;

      const nextTile = activeRound.guesses[letters.length + 1];
      if (nextTile) {
        nextTile.isActive = true;
      }

      letters.push(key);

      const isFirstInteraction =
        letters.length === 1 && this._currentRoundIndex === 0;

      if (isFirstInteraction) {
        this._gameStartTime = Date.now();
      }

      return;
    }

    /*
     * This check prevents a scenario where the hint button was clicked,
     * giving it focus, and then thhe 'Enter' key on a keyboard was used to Submut a guess.
     * Since the hint button has focus it will trigger another hint deployment
     * even though that is not the user's desire.
     */
    const numFinalGuess = this._numGuessesInRound - 1;
    const areThereEmptyTiles = activeRound.letters[numFinalGuess] === undefined;

    if (key === SpecialKeysEnum.Hint && areThereEmptyTiles) {
      this._showHint();
    }
  }

  ngOnInit(): void {
    this._storageSvc.settings$.subscribe((settings) => {
      this.settings = settings;
    });

    this._storageSvc.setDefaultSettings();

    this._numPlayedAllTime = this._storageSvc.getGamesPlayedCount();

    this._pwa.checkForUpdateFlag();
    this._pwa.hasUpdateFlag$.subscribe((isFlagPresent) => {
      this.isVersionUpdated = isFlagPresent;
    });
    this._displayInstructions();

    this.rounds[this._currentRoundIndex].isActiveRound = true;
  }

  // new game animation event handler (on complete)
  onBoardCleared(event: AnimationEvent): void {
    // event.toState === true when animation completed
    if (event.toState) {
      this._toastr
        .makeToast({
          message: ToastrMessagesEnum.WellWishes,
          options: { timeOut: 1000 },
        })
        .onHidden.subscribe(() => {
          this._setCursorToFirstPos();
          this.isBoardLocked = false;
          this.shouldClearBoard = false;
        });
    }
  }

  onRoundCompleteAnim(event: AnimationEvent, numRound: number): void {
    // puzzle was solved
    if (event.toState === this.roundFinish.Solved) {
      const successVibDuration = 200;
      const successVibPause = 100;

      vibrateDevice([successVibDuration, successVibPause, successVibDuration]);

      this._toastr
        .makeToast({
          message: this._isFastestTime
            ? 'New Fastest Win!'
            : getSuccessMessage(numRound),
        })
        .onHidden.subscribe(() => {
          this._captureHintUsage();
          this._showSummaryModal();
        });

      return;
    }

    const numFinalRound = this._numRounds - 1;

    if (event.toState === this.roundFinish.Completed) {
      // not the final round and puzzle is unsolved
      if (numRound !== numFinalRound) {
        this.rounds[this._currentRoundIndex - 1].isActiveRound = false;
        this.rounds[this._currentRoundIndex].isActiveRound = true;
        this._setCursorToFirstPos();
        this.isBoardLocked = false;
      } else {
        // final round and the user lost
        this._captureHintUsage();
        this._showSummaryModal();
      }
    }
  }

  openNav(): void {
    this.isNavOpen = true;
    this._analyticsSvc.gaCaptureModalOpen(ModalNameEnum.SideMenu);
  }

  openSettings(): void {
    this._analyticsSvc.gaCaptureModalOpen(ModalNameEnum.Settings);
    this._modalSvc.openModal(ModalNameEnum.Settings);
  }

  reloadWin(): void {
    this._pwa.reloadWindow();
  }

  roundTrackBy = (index: number): number => index;
  tileTrackBy = (index: number): number => index;

  private _captureHintUsage(): void {
    this._analyticsSvc.gaCaptureAnalyticsEvent('hint_usage', {
      num_hints_used: GameParamsEnum.NumHints - this._numHintsRemaining,
    });
  }

  private _confirmNewGameRequest(): void {
    this._analyticsSvc.gaCaptureModalOpen(ModalNameEnum.Confirm);

    this._modalSvc
      .openModal(ModalNameEnum.Confirm, {
        title: NewGamePromptEnum.Title,
        message: NewGamePromptEnum.Message,
      })
      .subscribe((wantsNewGame: boolean | undefined) => {
        this._analyticsSvc.gaCaptureAnalyticsEvent('new_game_request', {
          new_game_started: wantsNewGame,
        });

        if (wantsNewGame) {
          this._newGame();
        }
      });
  }

  private _displayInstructions(): void {
    if (this._storageSvc.hasSeenInstructions()) {
      this._newGame();
    } else {
      this._modalSvc.openModal(ModalNameEnum.Instructions).subscribe(() => {
        this._newGame();
        this._storageSvc.saveInstructionViewState();
      });
    }
  }

  private _incrementGameCount(): void {
    this._numPlayedSession += 1;
    this._numPlayedAllTime += 1;
    this._storageSvc.saveNumGames(this.hasWonGame);
  }

  private _newGame(): void {
    this._resetGameBoard();

    this._promptForDonation().subscribe(() => {
      this._toastr
        .makeToast({
          message: ToastrMessagesEnum.NewGame,
          options: { timeOut: 1000 },
        })
        .onHidden.subscribe(() => {
          this.shouldClearBoard = true;

          this._puzzleSvc.getPuzzle().subscribe((newWord: string) => {
            this._solution = newWord;

            // provides the correct letter (hint) for the tile
            this.rounds.forEach((round) => {
              round.guesses.forEach((guess, index) => {
                guess.correctLetter = this._solution[index];
              });
            });

            if (!environment.production) {
              console.log(this._solution);
            }
          });
        });
    });
  }

  private _promptForDonation(): Observable<any> {
    const numGames = 5;
    const isTimeForDonation =
      this._numPlayedAllTime > 0 && this._numPlayedAllTime % numGames === 0;

    if (isTimeForDonation) {
      if (this._numLastDonationGame === this._numPlayedAllTime) {
        return of({});
      }

      this._numLastDonationGame = this._numPlayedAllTime;

      return this._modalSvc.openModal(ModalNameEnum.Donation, {
        title: 'A Brief Interruption',
        message: 'Your game will start momentarily.',
      });
    }

    // fall-through observable
    return of({});
  }

  private _resetGameBoard(): void {
    this._currentRoundIndex = 0;
    this._guessSvc.reset();
    this._lettersDiscovered = [];
    this.hasWonGame = false;
    this.haveTilesBounced = false;
    this.isBoardLocked = true;
    this.isStartingNewGame = true;
    this._numHintsRemaining = GameParamsEnum.NumHints;
    this.rounds = getPristineGameModel();
    this.rounds[this._currentRoundIndex].isActiveRound = true;
  }

  private _saveGameTime(): void {
    const gameTime = calcElapsedTime(this._gameStartTime, Date.now());
    this._gameDuration = gameTime.readableTime;
    this._isFastestTime = this._storageSvc.saveGameTime(gameTime);
    this._analyticsSvc.gaCaptureAnalyticsEvent('game_duration', {
      total_game_time: this._gameDuration,
    });
  }

  private _setCursorToFirstPos(): void {
    this.rounds[this._currentRoundIndex].guesses[0].isActive = true;
  }

  private _showHint(): void {
    if (this._numHintsRemaining > 0) {
      this._numHintsRemaining -= 1;
      const currentRound = this.rounds[this._currentRoundIndex];
      const currentGuesses = currentRound.guesses;

      // collect slots to display hints, but only if the tile is unfilled
      const unusedHintIndexes = currentGuesses.reduce(
        (accumulator: Array<number>, currVal, currIndex) => {
          if (
            !currVal.hasRevealedHint &&
            currIndex >= currentRound.letters.length
          ) {
            accumulator.push(currIndex);
          }

          return accumulator;
        },
        []
      );

      const randomHintIndex =
        unusedHintIndexes[Math.floor(Math.random() * unusedHintIndexes.length)];

      if (randomHintIndex > -1) {
        for (let i = 0; i < this.rounds.length; i = i + 1) {
          this.rounds[i].guesses[randomHintIndex] = {
            ...this.rounds[i].guesses[randomHintIndex],
            hasRevealedHint: true,
          };
        }
      }
    }

    let pluralMsg = this._numHintsRemaining === 1 ? 'Hint' : 'Hints';

    this._toastr.makeToast({
      message: `${this._numHintsRemaining} ${pluralMsg} Remaining.`,
    });
  }

  private _showSummaryModal(): void {
    this._modalSvc
      .openModal(ModalNameEnum.Summary, {
        fastestWinTime:
          this._storageSvc.getFastestWinTime() || this._gameDuration,
        gameTime: this._gameDuration,
        solution: this._solution,
        wasGameWon: this.hasWonGame,
      })
      .subscribe(() => this._newGame());
  }

  private _submitGuess(guessedWord: string): void {
    const activeRound = this.rounds[this._currentRoundIndex];
    // updates tiles
    activeRound.guesses = getGuessState(guessedWord, this._solution);

    if (this.settings?.hardMode) {
      const letters = activeRound.guesses
        .filter((guess) => guess.isCorrect || guess.isPresent)
        .map((guess) => {
          const index = activeRound.guesses.indexOf(guess);
          const nonZeroIndex = index + 1;
          return { ...guess, index, nonZeroIndex };
        }) as IDiscoveredLetters[];

      this._lettersDiscovered = Array.from(new Set(letters));
    }

    // updates keyboard
    this._guessSvc.updateGuess(activeRound.guesses);

    const numNextRound = this._currentRoundIndex + 1;

    this._currentRoundIndex = numNextRound;

    activeRound.isRoundComplete = true;
    this.hasWonGame = guessedWord === this._solution;
    activeRound.isWinningRound = this.hasWonGame;

    const isGameOver = numNextRound === this._numRounds || this.hasWonGame;

    if (isGameOver) {
      this._incrementGameCount();
    }

    if (this.hasWonGame) {
      this._saveGameTime();
      this._storageSvc.saveWinData(this._currentRoundIndex, this._solution);
    }
  }

  private _verifyWord(guessedWord: string) {
    // check for slow response from API provider
    let didApiRespond = false;

    const verifyWord$ = this._verifyWordSvc.verifyWord(guessedWord).subscribe({
      next: () => {
        didApiRespond = true;
        this._submitGuess(guessedWord);
      },
      error: (err: HttpErrorResponse) => {
        didApiRespond = true;

        // we are offline and the word is not in the service worker cache
        if (!window.navigator.onLine) {
          // disable verification until we're online again
          this._submitGuess(guessedWord);
        }

        // word not found in dictionary
        if (err.status === 404) {
          // trigger head shake animation
          this.rounds[this._currentRoundIndex].isInvalidWord = true;
          vibrateDevice(this._headShakeVibPattern);

          this._toastr.makeToast({
            message: ToastrMessagesEnum.Invalid,
          });
        }
      },
    });

    setTimeout(() => {
      if (!didApiRespond) {
        // cancel http request
        verifyWord$.unsubscribe();
        // bypass word verification in favor of user's experience
        this._submitGuess(guessedWord);
      }
    }, API_TIMEOUT_DURATION);
  }
}

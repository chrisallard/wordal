import { Injectable } from '@angular/core';
import { LOCAL_STORAGE_KEY, SESSION_STORAGE_KEY } from '@app/config/app.config';
import { IDistribution, IGameDuration, IStoredData } from '@app/ts/interfaces';

const zeroWins = 0;
export const distributionModel = [
  { numRound: 1, numWins: zeroWins, isWinner: false, suffix: 'st' },
  { numRound: 2, numWins: zeroWins, isWinner: false, suffix: 'nd' },
  { numRound: 3, numWins: zeroWins, isWinner: false, suffix: 'rd' },
  { numRound: 4, numWins: zeroWins, isWinner: false, suffix: 'th' },
  { numRound: 5, numWins: zeroWins, isWinner: false, suffix: 'th' },
  { numRound: 6, numWins: zeroWins, isWinner: false, suffix: 'th' },
];
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  getFastestWinTime(): string {
    const storedData = this.getLocalStorageData() as IStoredData;

    if (storedData) {
      return storedData?.stats?.fastestTime?.readableTime || '';
    }

    return '';
  }

  getGamesPlayedCount(): number {
    const storedData = this.getLocalStorageData();
    let gamesPlayed = 0;

    if (storedData) {
      gamesPlayed = storedData.stats?.numGamesPlayed || gamesPlayed;
    }

    return gamesPlayed;
  }

  getLocalStorageData(): IStoredData | null {
    const localStorageData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return localStorageData ? JSON.parse(localStorageData) : null;
  }

  getSessionData(): any | null {
    const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  }

  hasSeenInstructions(): boolean {
    const storedData = this.getLocalStorageData();

    if (!storedData) {
      return false;
    }

    return storedData?.instructions?.viewed || false;
  }

  saveWinData(numRound: number, solution: string): void {
    this._saveGuessDistribution(numRound);
    this._saveNumWins();
    this._saveWinningPuzzle(solution);
  }

  saveGameTime(gameTime: IGameDuration): boolean {
    let isFastestTime = true;
    const storedData = this.getLocalStorageData();
    const stats = {
      fastestTime: {
        elapsedMilliseconds: gameTime.elapsedMilliseconds,
        readableTime: gameTime.readableTime,
      } as IGameDuration,
    };

    if (!storedData) {
      this.setLocalStorageData({ stats });
    } else {
      const fastestSavedTime =
        storedData?.stats?.fastestTime?.elapsedMilliseconds;
      let shouldUpdate = true;

      // don't update if the new time is slower than the fastest saved
      if (fastestSavedTime && fastestSavedTime < gameTime.elapsedMilliseconds) {
        shouldUpdate = false;
        isFastestTime = false;
      }

      if (shouldUpdate) {
        this.setLocalStorageData({
          ...storedData,
          stats: {
            ...storedData.stats,
            fastestTime: {
              elapsedMilliseconds: gameTime.elapsedMilliseconds,
              readableTime: gameTime.readableTime,
            } as IGameDuration,
          },
        });
      }
    }

    return isFastestTime;
  }

  saveInstructionViewState(): void {
    const storedData = this.getLocalStorageData();
    let update = {
      instructions: {
        viewed: true,
      },
    };

    if (storedData) {
      update = { ...storedData, ...update };
    }

    this.setLocalStorageData(update);
  }

  saveNumGames(gameCount: number): void {
    const storedData = this.getLocalStorageData();
    let update = {
      stats: {
        numGamesPlayed: gameCount,
      },
    };

    if (storedData) {
      update = {
        ...storedData,
        stats: {
          ...(storedData?.stats || {}),
          numGamesPlayed: gameCount,
        },
      };
    }
    this.setLocalStorageData(update);
  }

  setLocalStorageData(data: object): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }

  private _saveGuessDistribution(numWinningRound: number): void {
    const storedData = this.getLocalStorageData();

    let update = {
      stats: {
        guessDistribution: [...distributionModel],
      },
    } as IStoredData;

    if (storedData) {
      const currentDistribution =
        storedData?.stats?.guessDistribution || update.stats.guessDistribution;

      const guessDistribution = currentDistribution!.map(
        (distribution: IDistribution) => {
          // flip last win's flag
          distribution.isWinner = false;

          if (distribution.numRound === numWinningRound) {
            distribution.isWinner = true;
            distribution.numWins += 1;
          }

          return distribution;
        }
      );

      update = {
        ...storedData,
        stats: {
          ...storedData.stats,
          guessDistribution,
        },
      };
    } else {
      const distributionIndex = numWinningRound - 1;
      update.stats.guessDistribution![distributionIndex] = {
        ...update.stats.guessDistribution![distributionIndex],
        isWinner: true,
        numWins: 1,
      };
    }

    this.setLocalStorageData(update);
  }

  private _saveNumWins(): void {
    const storedData = this.getLocalStorageData();
    let update = {
      stats: {
        numAllTimeWins: 1,
      },
    } as IStoredData;

    const numGamesPlayed = storedData?.stats?.numGamesPlayed || 1;
    let numSavedWins = storedData?.stats?.numAllTimeWins || 0;

    numSavedWins = numSavedWins + 1;

    update = {
      ...(storedData || {}),
      stats: {
        ...(storedData?.stats || {}),
        numAllTimeWins: numSavedWins,
        winPercentage: Math.floor((numSavedWins / numGamesPlayed) * 100),
      },
    };

    this.setLocalStorageData(update);

    const sessionData = this.getSessionData();

    const numSessionWins = sessionData ? sessionData : 0;
    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(numSessionWins + 1)
    );
  }

  private _saveWinningPuzzle(puzzle: string): void {
    const storedData = this.getLocalStorageData();
    let update = {
      completedPuzzles: [puzzle],
    };

    if (storedData) {
      update = {
        ...storedData,
        completedPuzzles: [...(storedData?.completedPuzzles || []), puzzle],
      };
    }

    this.setLocalStorageData(update);
  }
}

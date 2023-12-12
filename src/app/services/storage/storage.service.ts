import { Injectable } from '@angular/core';
import { LOCAL_STORAGE_KEY, SESSION_STORAGE_KEY } from '@app/config/app.config';
import { SettingsTypeEnum } from '@app/ts/enums';
import {
  IDistribution,
  IGameDuration,
  IStoredData,
  IStoredSettings,
} from '@app/ts/interfaces';
import { Subject } from 'rxjs';

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
  private _settings$ = new Subject<IStoredSettings>();
  settings$ = this._settings$.asObservable();

  getFastestWinTime = (): string =>
    this.getLocalStorageData()?.stats?.fastestTime?.readableTime || '';

  getGamesPlayedCount = (): number =>
    this.getLocalStorageData()?.stats?.numGamesPlayed || 0;

  getLocalStorageData(): IStoredData | null {
    const localStorageData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return localStorageData ? JSON.parse(localStorageData) : null;
  }

  getSessionData(): any | null {
    const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  }

  hasSeenInstructions = (): boolean =>
    this.getLocalStorageData()?.instructions?.viewed || false;

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

  saveNumGames(wasGameWon: boolean): void {
    const storedData = this.getLocalStorageData();

    let numGamesPlayed = storedData?.stats?.numGamesPlayed || 0;
    numGamesPlayed = numGamesPlayed += 1;

    let numSavedWins = storedData?.stats?.numAllTimeWins || 0;
    numSavedWins = wasGameWon ? (numSavedWins += 1) : numSavedWins;

    const update = {
      ...(storedData || {}),
      stats: {
        ...(storedData?.stats || {}),
        numGamesPlayed,
        winPercentage: Math.floor((numSavedWins / numGamesPlayed) * 100),
      },
    };

    this.setLocalStorageData(update);
  }

  setLocalStorageData(data: object): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }

  setDefaultSettings(): void {
    const defaultSettings: any = {
      settings: {},
    };

    const settingNames: Array<string> = [];
    const storedData = this.getLocalStorageData();

    for (const [key, val] of Object.entries(SettingsTypeEnum)) {
      settingNames.push(val);
      // all settings are disabled by default
      defaultSettings.settings[val] = false;
    }

    if (storedData?.settings) {
      const existingSettings = { ...storedData.settings } as any;

      /*
       * SettingsTypeEnum is the single source of truth. If there is a
       * setting in storage that isnt found in the enum it is removed
       */
      for (const prop in existingSettings) {
        if (!settingNames.includes(prop)) {
          delete existingSettings[prop];
        }
      }

      // add any new settings to existing ones
      defaultSettings.settings = {
        ...defaultSettings.settings,
        ...existingSettings,
      };
    }

    this.setLocalStorageData({
      ...(storedData || {}),
      ...defaultSettings,
    });

    this._settings$.next(defaultSettings.settings);
  }

  saveSettings(data: IStoredSettings): void {
    const storedData = this.getLocalStorageData();

    const update = {
      ...(storedData || {}),
      settings: {
        ...(storedData?.settings || {}),
        ...data,
      },
    };
    this.setLocalStorageData(update);
    this._settings$.next(update.settings);
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

    let numSavedWins = storedData?.stats?.numAllTimeWins || 0;
    numSavedWins = numSavedWins + 1;

    update = {
      ...(storedData || {}),
      stats: {
        ...(storedData?.stats || {}),
        numAllTimeWins: numSavedWins,
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

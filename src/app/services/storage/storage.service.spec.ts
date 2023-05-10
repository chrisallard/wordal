import { TestBed } from '@angular/core/testing';
import { LOCAL_STORAGE_KEY, SESSION_STORAGE_KEY } from '@app/config/app.config';
import { IGameDuration, IStoredData } from '@app/ts/interfaces';
import { mockGameTime } from '@app/utils/calc-elapsed-time.spec';
import {
  distributionModel,
  StorageService,
} from '@services/storage/storage.service';

describe('StorageService', () => {
  let storageSvc: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    storageSvc = TestBed.inject(StorageService);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  });

  it('should be created', () => {
    expect(storageSvc).toBeTruthy();
  });

  describe('getFastestWinTime', () => {
    it('should return a pretty print time, if available', () => {
      storageSvc.saveGameTime(mockGameTime);
      const gameTime = storageSvc.getFastestWinTime();

      expect(gameTime).toEqual(mockGameTime.readableTime);
    });

    it('should return an empty string if no data found', () => {
      const gameTime = storageSvc.getFastestWinTime();

      expect(gameTime).toEqual('');
    });
  });

  describe('getGamesPlayedCount', () => {
    it('should return zero if no games played', () => {
      const numGamesPlayed = storageSvc.getGamesPlayedCount();
      expect(numGamesPlayed).toEqual(0);
    });

    it('should return the number of games played', () => {
      const mockNumGames = 1;
      storageSvc.saveNumGames(mockNumGames);

      const numGamesPlayed = storageSvc.getGamesPlayedCount();
      expect(numGamesPlayed).toEqual(mockNumGames);
    });
  });

  describe('getLocalStorageData', () => {
    it('should return null if no saved data found', () => {
      const storedData = storageSvc.getLocalStorageData();
      expect(storedData).toEqual(null);
    });

    it('should return parsed local storage data if it exists', () => {
      const mockStorageData = {
        stats: {
          fastestTime: mockGameTime,
        },
      };
      storageSvc.setLocalStorageData(mockStorageData);

      const storedData = storageSvc.getLocalStorageData();
      expect(storedData).toEqual(mockStorageData);
    });
  });

  describe('getSessionData', () => {
    it('should return null if no saved data found', () => {
      const storedData = storageSvc.getSessionData();
      expect(storedData).toEqual(null);
    });

    it('should return parsed local storage data if it exists', () => {
      const expectedNumWins = 1;
      const mockWinningRoundNum = 3;
      const mockSolution = 'abate';

      storageSvc.saveWinData(mockWinningRoundNum, mockSolution);

      const storedData = storageSvc.getSessionData();
      expect(storedData).toEqual(expectedNumWins);
    });
  });

  describe('hasSeenInstructions', () => {
    it('should return true if instructions were seen', () => {
      storageSvc.saveInstructionViewState();
      const hasSeenInstructions = storageSvc.hasSeenInstructions();
      expect(hasSeenInstructions).toBeTrue();
    });

    it('should return false if the instructions were not seen', () => {
      const hasSeenInstructions = storageSvc.hasSeenInstructions();
      expect(hasSeenInstructions).toBeFalse();
    });
  });

  describe('saveWinData', () => {
    let mockSolution: string;

    beforeEach(() => {
      mockSolution = 'abate';
    });

    it('should store game info in local storage', () => {
      const numWinningRound = 1;
      // rounds start at 1 and dist array starts at 0. The dist round is always 1 behind the winning round number
      const numDistRow = numWinningRound - 1;

      let mockGuessDist = [...distributionModel];

      mockGuessDist[numDistRow] = {
        ...mockGuessDist[numDistRow],
        isWinner: true,
        numWins: 1,
      };

      const expectedLocalData = {
        completedPuzzles: [mockSolution],
        stats: {
          guessDistribution: mockGuessDist,
          numAllTimeWins: 1,
          winPercentage: 100,
        },
      };

      storageSvc.saveWinData(numWinningRound, mockSolution);

      const storedLocalData = storageSvc.getLocalStorageData();
      expect(storedLocalData).toEqual(expectedLocalData);
    });

    it('should update stored data as games are played', () => {
      // pre-seed with data
      storageSvc.setLocalStorageData({
        stats: {
          guessDistribution: [
            {
              numRound: 1,
              numWins: 1,
              isWinner: true,
              suffix: 'st',
            },
            {
              numRound: 2,
              numWins: 0,
              isWinner: false,
              suffix: 'nd',
            },
            {
              numRound: 3,
              numWins: 0,
              isWinner: false,
              suffix: 'rd',
            },
            {
              numRound: 4,
              numWins: 0,
              isWinner: false,
              suffix: 'th',
            },
            {
              numRound: 5,
              numWins: 0,
              isWinner: false,
              suffix: 'th',
            },
            {
              numRound: 6,
              numWins: 0,
              isWinner: false,
              suffix: 'th',
            },
          ],
          numGamesPlayed: 2,
          numAllTimeWins: 1,
          winPercentage: 100,
        },
        completedPuzzles: ['lunar'],
      });

      const expectedLocalData = {
        stats: {
          guessDistribution: [
            {
              numRound: 1,
              numWins: 1,
              isWinner: false,
              suffix: 'st',
            },
            {
              numRound: 2,
              numWins: 0,
              isWinner: false,
              suffix: 'nd',
            },
            {
              numRound: 3,
              numWins: 1,
              isWinner: true,
              suffix: 'rd',
            },
            {
              numRound: 4,
              numWins: 0,
              isWinner: false,
              suffix: 'th',
            },
            {
              numRound: 5,
              numWins: 0,
              isWinner: false,
              suffix: 'th',
            },
            {
              numRound: 6,
              numWins: 0,
              isWinner: false,
              suffix: 'th',
            },
          ],
          numGamesPlayed: 2,
          numAllTimeWins: 2,
          winPercentage: 100,
        },
        completedPuzzles: ['lunar', 'abate'],
      };

      const numWinningRound = 3;
      storageSvc.saveWinData(numWinningRound, mockSolution);

      const storedLocalData = storageSvc.getLocalStorageData();

      expect(storedLocalData).toEqual(expectedLocalData);
    });

    it('should calculate and store win %', () => {
      // pre-seed with data
      storageSvc.setLocalStorageData({
        stats: {
          guessDistribution: [
            {
              numRound: 1,
              numWins: 1,
              isWinner: true,
              suffix: 'st',
            },
            {
              numRound: 2,
              numWins: 0,
              isWinner: false,
              suffix: 'nd',
            },
            {
              numRound: 3,
              numWins: 0,
              isWinner: false,
              suffix: 'rd',
            },
            {
              numRound: 4,
              numWins: 0,
              isWinner: false,
              suffix: 'th',
            },
            {
              numRound: 5,
              numWins: 0,
              isWinner: false,
              suffix: 'th',
            },
            {
              numRound: 6,
              numWins: 0,
              isWinner: false,
              suffix: 'th',
            },
          ],
          numGamesPlayed: 2,
          numAllTimeWins: 0,
          winPercentage: 0,
        },
        completedPuzzles: ['lunar'],
      });

      // increment num games by 1
      storageSvc.saveNumGames(3);

      // trigger first win
      const numWinningRound = 3;
      storageSvc.saveWinData(numWinningRound, mockSolution);

      const storedLocalData = storageSvc.getLocalStorageData();

      // 3 games and 1 win = 33%
      const expectedWinPercentage = 33;
      expect(storedLocalData?.stats.winPercentage).toEqual(
        expectedWinPercentage
      );
    });

    it('should save winning puzzles', () => {
      const numWinningRound = 3;
      storageSvc.saveWinData(numWinningRound, mockSolution);

      const storedLocalData = storageSvc.getLocalStorageData();

      const storedPuzzles = storedLocalData?.completedPuzzles || [];
      expect(storedPuzzles[0]).toEqual(mockSolution);
    });

    it('should increment and store session wins', () => {
      const numSessionWins = 1;
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(numSessionWins)
      );

      const numWinningRound = 5;
      storageSvc.saveWinData(numWinningRound, mockSolution);

      const storedSessionData = storageSvc.getSessionData();
      expect(storedSessionData).toEqual(numSessionWins + 1);
    });
  });

  describe('saveGameTime', () => {
    it('should return true if it is a record time', () => {
      const isFastestTime = storageSvc.saveGameTime(mockGameTime);

      expect(isFastestTime).toBeTrue();
    });

    it('should return false if it is not a record time', () => {
      // set default value to check against
      storageSvc.saveGameTime(mockGameTime);

      const slowerWinTime = {
        elapsedMilliseconds: 20000,
        readableTime: '00:20',
      } as IGameDuration;

      // submit slower time
      const isFastestTime = storageSvc.saveGameTime(slowerWinTime);

      expect(isFastestTime).toBeFalse();
    });

    it('should save the fastest win time', () => {
      storageSvc.saveGameTime(mockGameTime);
      const fastestTime = storageSvc.getFastestWinTime();
      expect(fastestTime).toEqual(mockGameTime.readableTime);
    });
  });

  describe('saveInstructionViewState', () => {
    it('should save a flag that the instructions were viewed', () => {
      let storedData = storageSvc.getLocalStorageData();
      expect(storedData).toBeNull();

      storageSvc.saveInstructionViewState();

      storedData = storageSvc.getLocalStorageData();
      expect(storedData?.instructions?.viewed).toBeTrue();
    });
  });

  describe('saveNumGames', () => {
    it('should save the number of games played', () => {
      let storedData = storageSvc.getLocalStorageData();
      expect(storedData).toBeNull();

      const numGamesPlayed = 5;
      storageSvc.saveNumGames(numGamesPlayed);

      storedData = storageSvc.getLocalStorageData();
      expect(storedData?.stats.numGamesPlayed).toEqual(numGamesPlayed);
    });
  });

  describe('setLocalStorageData', () => {
    it('should save an object to local storage', () => {
      let storedData = storageSvc.getLocalStorageData();
      expect(storedData).toBeNull();

      const mockData = { stats: { numAllTimeWins: 4 } } as IStoredData;

      storageSvc.setLocalStorageData(mockData);
      storedData = storageSvc.getLocalStorageData();
      expect(storedData).toEqual(mockData);
    });
  });
});

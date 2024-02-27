import { GuessFeedbackEnum } from '@app/ts/enums';

export interface IAnimimationTrans {
  fromState: string;
  toState: string;
}

interface IDefinition {
  antonyms: string[];
  definition: string;
  example?: string;
  synonyms: string[];
}

export interface IDictionaryItem extends IWord {
  license: {
    name: string;
    url: string;
  };
  meanings: IWordMeaning[];
  phonetic: string;
  phonetics: IPhonetics[];
  sourceUrls: string[];
}

export interface IDistribution {
  isWinner: boolean;
  numRound: number;
  numWins: number;
  suffix: string;
}

export interface IGameDuration {
  elapsedMilliseconds: number;
  readableTime: string;
}

export interface IGameSummary {
  gameTime: string;
  solution: string;
  wasGameWon: boolean;
}

export interface IGuess {
  alias?: string;
  isActive?: boolean;
  isCorrect?: boolean;
  isPresent?: boolean;
  label?: string;
  row?: number;
  state?: GuessFeedbackEnum;
  value?: string | null;
  correctLetter?: string;
  hasRevealedHint?: boolean;
}

export interface IDiscoveredLetters extends IGuess {
  index: number;
  nonZeroIndex: number;
}

export interface IKeyBoard {
  [key: string]: IGuess;
}

interface IPhonetics {
  audio: string;
  text: string;
}

export interface IRound {
  guesses: IGuess[];
  isInvalidWord: boolean;
  isRoundComplete: boolean;
  isWinningRound: boolean;
  letters: Array<string>;
  isActiveRound: boolean;
}

export interface ISimpleMessage {
  message: string;
  title: string;
}

export interface IStats {
  numSessionWins: number;
  numTotalWins: number;
  numTotalGames: number;
}

export interface IStoredData {
  completedPuzzles?: Array<string>;
  instructions?: {
    viewed: boolean;
  };
  settings?: IStoredSettings;
  stats: {
    fastestTime?: {
      elapsedMilliseconds: number;
      readableTime: string;
    };
    guessDistribution?: IDistribution[];
    numGamesPlayed?: number;
    numAllTimeWins?: number;
    winPercentage?: number;
  };
}

export interface IStoredSettings {
  hardMode: boolean;
}

export interface IWord {
  word: string;
}

export interface IWordMeaning {
  antonyms: string[];
  definitions: IDefinition[];
  partOfSpeech: string;
  synonyms: string[];
}

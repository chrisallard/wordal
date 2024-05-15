export enum GameParamsEnum {
  NumRounds = 6,
  NumGuesses = 5,
  NumHints = NumGuesses - 1,
}

export enum GuessFeedbackEnum {
  Absent = 'absent',
  Present = 'present',
  Correct = 'correct',
  Unused = 'unused',
}

export enum KeyColorEnum {
  AbsentBgColor = '#9e9e9e',
  CorrectBgColor = '#66bb6a',
  PresentBgColor = '#ff9800',
  UnusedBgColor = '#ffffff',
  UnusedColor = '#000000',
  UsedColor = '#ffffff',
}

export enum ModalNameEnum {
  About = 'about',
  Confirm = 'confirm',
  Definition = 'definition',
  Donation = 'donation',
  Instructions = 'instructions',
  SideMenu = 'menu',
  Settings = 'settings',
  Stats = 'extended stats',
  Summary = 'summary',
}

export enum NewGamePromptEnum {
  Title = 'New Game',
  Message = 'Do you want to start a new game?',
}

export enum RoundFinishTypeEnum {
  Completed = 'completed',
  Solved = 'solved',
}

export enum SpecialKeysEnum {
  Backspace = 'backspace',
  Enter = 'enter',
  Hint = 'mystery',
  Hint_Label = 'get a hint',
  Refresh = 'restart_alt',
  Refresh_Label = 'new game',
  Submit = 'submit',
  Tab = 'tab',
  Esc = 'escape',
}

export enum SettingsTypeEnum {
  HardMode = 'hardMode',
}

export enum ToastrMessagesEnum {
  Invalid = 'Not in Word List',
  NewGame = 'Starting New Game',
  SuccessDefault = 'Solid Work!',
  SuccessFifthAttempt = 'Nailed it!',
  SuccessFinalAttempt = 'Phew!',
  SuccessFirstAttempt = 'Jaw Dropping!',
  SuccessFourthAttempt = 'Way to Go!',
  SuccessSecondAttempt = 'Unbelievable!',
  SuccessThirdAttempt = SuccessDefault,
  TooFew = 'Not Enough Letters',
  WellWishes = 'Good Luck!',
}

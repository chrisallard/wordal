import { ToastrMessagesEnum } from '@app/ts/enums';

export function getSuccessMessage(numWinningRound: number): string {
  let successMsg;
  switch (numWinningRound) {
    case 0:
      successMsg = ToastrMessagesEnum.SuccessFirstAttempt;
      break;
    case 1:
      successMsg = ToastrMessagesEnum.SuccessSecondAttempt;
      break;
    case 2:
      successMsg = ToastrMessagesEnum.SuccessThirdAttempt;
      break;
    case 3:
      successMsg = ToastrMessagesEnum.SuccessFourthAttempt;
      break;
    case 4:
      successMsg = ToastrMessagesEnum.SuccessFifthAttempt;
      break;
    case 5:
      successMsg = ToastrMessagesEnum.SuccessFinalAttempt;
      break;
    default:
      successMsg = ToastrMessagesEnum.SuccessDefault;
      break;
  }

  return successMsg;
}

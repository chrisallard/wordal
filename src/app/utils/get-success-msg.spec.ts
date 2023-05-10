import { ToastrMessagesEnum } from '@app/ts/enums';
import { getSuccessMessage } from '@utils/get-success-msg.utils';

describe('getSuccessMessage', () => {
  it(`should return a default message if the supplied arg doesn't match`, () => {
    const wrongNum = 1234;
    const message = getSuccessMessage(wrongNum);

    expect(message).toEqual(ToastrMessagesEnum.SuccessDefault);
  });

  it(`should return a specific message for each round's number`, () => {
    const message1 = getSuccessMessage(0);
    expect(message1).toEqual(ToastrMessagesEnum.SuccessFirstAttempt);

    const message2 = getSuccessMessage(1);
    expect(message2).toEqual(ToastrMessagesEnum.SuccessSecondAttempt);

    const message3 = getSuccessMessage(2);
    expect(message3).toEqual(ToastrMessagesEnum.SuccessThirdAttempt);

    const message4 = getSuccessMessage(3);
    expect(message4).toEqual(ToastrMessagesEnum.SuccessFourthAttempt);

    const message5 = getSuccessMessage(4);
    expect(message5).toEqual(ToastrMessagesEnum.SuccessFifthAttempt);

    const message6 = getSuccessMessage(5);
    expect(message6).toEqual(ToastrMessagesEnum.SuccessFinalAttempt);
  });
});

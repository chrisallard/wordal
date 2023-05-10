import { IGameDuration } from '../ts/interfaces';
import { calcElapsedTime } from './calc-elapsed-time.utils';

export const mockGameTime: IGameDuration = {
  elapsedMilliseconds: 14316,
  readableTime: '00:14',
};

describe('calcElapsedTime', () => {
  it('should return a well structured response', () => {
    let time: IGameDuration;
    const startTime = 1678294729281;
    const endTime = 1678294743597;

    time = calcElapsedTime(startTime, endTime);

    expect(time).toEqual(mockGameTime);
  });
});

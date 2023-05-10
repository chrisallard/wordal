import { IGameDuration } from '@app/ts/interfaces';

export function calcElapsedTime(
  startTime: number,
  endTime: number
): IGameDuration {
  const millisecondsInASecond = 1000;
  const secondsInADay = 86400;
  const secondsInAMinute = 60;
  const secondsInAnHour = 3600;
  const secondsInAYear = 31536000;

  const elapsedMilliseconds = endTime - startTime;
  const elapsedSeconds = elapsedMilliseconds / millisecondsInASecond;

  const numElapsedHours = Math.floor(
    ((elapsedSeconds % secondsInAYear) % secondsInADay) / secondsInAnHour
  );

  const numElapsedMins = Math.floor(
    (((elapsedSeconds % secondsInAYear) % secondsInADay) % secondsInAnHour) /
      secondsInAMinute
  );

  const numElapsedSeconds = Math.floor(
    (((elapsedSeconds % secondsInAYear) % secondsInADay) % secondsInAnHour) %
      secondsInAMinute
  );

  // only has a value if more than 1 hour
  let hours = numElapsedHours > 0 ? `${numElapsedHours}:` : '';

  // default to double zeros if no minutes
  let mins = numElapsedMins > 0 ? `${numElapsedMins}` : '00';
  let secs = `${numElapsedSeconds}`;

  const doubleDigitStart = 10;
  // more than one hour, but less than 10 min, so append a zero to single digit minutes (Ex: 1:09:00)
  if (numElapsedHours >= 1 && numElapsedMins < doubleDigitStart) {
    mins = `0${mins}`;
  }

  // append a zero to single digit seconds (Ex: 00:03)
  if (numElapsedSeconds < doubleDigitStart) {
    secs = `0${secs}`;
  }

  // ex(s): 1:23:46 | 23:46 | 00:46
  const readableTime = `${hours}${mins}:${secs}`;

  return {
    elapsedMilliseconds,
    readableTime,
  };
}

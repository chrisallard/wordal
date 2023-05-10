import { vibrateDevice } from './vibrate-device.utils';

describe('vibrateDevice', () => {
  let vibPattern = [200, 200, 200];
  let winSpy: jasmine.Spy;

  beforeEach(() => {
    winSpy = spyOn(window.navigator, 'vibrate');
  });

  it('should invoke the navigators vibrate api with a passed pattern if supported', () => {
    vibrateDevice(vibPattern);
    expect(winSpy).toHaveBeenCalledWith(vibPattern);
  });

  it('should not invoke the navigators vibrate api if unsupported', () => {
    const nativeVibFn = navigator.vibrate;

    // @ts-ignore
    delete navigator.vibrate;

    vibrateDevice(vibPattern);
    expect(winSpy).not.toHaveBeenCalled();

    navigator.vibrate = nativeVibFn;
  });
});

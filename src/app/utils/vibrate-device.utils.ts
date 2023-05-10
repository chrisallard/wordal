export function vibrateDevice(vibratePattern: number | number[]): void {
  /*
     if device/browser supports vibrate API (iOS doesn't)
     see: https://caniuse.com/mdn-api_navigator_vibrate
     */
  if ('vibrate' in navigator) {
    window.navigator.vibrate(vibratePattern);
  }
}

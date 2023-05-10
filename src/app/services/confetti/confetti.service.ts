import { NumberFormatStyle } from '@angular/common';
import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

/*
    Shows confetti animations, just for fun.
    See: https://www.kirilv.com/canvas-confetti/
*/
@Injectable({
  providedIn: 'root',
})
export class ConfettiService {
  constructor() {}

  public cannon(): void {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: NumberFormatStyle) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        ...{
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        },
      });
      confetti({
        ...defaults,
        ...{
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        },
      });
    }, 250);
  }
}

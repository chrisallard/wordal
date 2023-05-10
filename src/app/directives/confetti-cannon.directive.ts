import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConfettiService } from '@services/confetti/confetti.service';

@Directive({
  selector: '[confettiCannon]',
})
export class ConfettiCannonDirective implements OnChanges {
  @Input() confettiCannon: boolean = false;

  constructor(private _confettiService: ConfettiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['confettiCannon'] && changes['confettiCannon'].currentValue) {
      this._confettiService.cannon();
    }
  }
}

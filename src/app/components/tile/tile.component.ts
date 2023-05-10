import {
  animate,
  AnimationEvent,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { getBounceAnimation } from '@app/animations/bounce.animation';
import { GuessFeedbackEnum } from '@app/ts/enums';
import { IGuess } from '@app/ts/interfaces';

const bounceTrigger = 'bounce';
const flipTrigger = 'flip';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  animations: [
    trigger('flipTile', [
      transition(`* => ${bounceTrigger}`, [
        animate('1000ms', getBounceAnimation()),
      ]),
    ]),

    trigger('flipTileInner', [
      state(
        flipTrigger,
        style({
          transform: 'rotateX(-180deg)',
        })
      ),
      transition(`* => ${flipTrigger}`, [
        animate(
          '500ms ease-in',
          style({
            transform: 'rotateX(-180deg)',
          })
        ),
      ]),
    ]),
  ],
})
export class TileComponent implements OnChanges {
  @Input() guess: IGuess = {};
  @Input() letter!: string;
  @Input() shouldBounce: boolean = false;
  @Input() shouldFlip: boolean = false;
  @Output() bounced = new EventEmitter();

  guessFeedback: string = '';

  // broadcast that the winning tile jump animation is complete
  tileBounced(event: AnimationEvent): void {
    if (event.toState === bounceTrigger) {
      this.bounced.emit(event);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // tiles are ready to be painted and revealed
    if (changes.shouldFlip?.currentValue) {
      const guess = changes.guess?.currentValue;

      if (guess) {
        // set tile style as either correct, present, or absent
        this.guessFeedback =
          guess.isPresent && !guess.isCorrect
            ? GuessFeedbackEnum.Present
            : guess.isCorrect
            ? GuessFeedbackEnum.Correct
            : GuessFeedbackEnum.Absent;
      }
    }
  }
}

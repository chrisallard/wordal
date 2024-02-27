import {
  AnimationEvent,
  animate,
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
import { slideInDown } from '@app/animations/slide-in-down.animation';
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
    trigger('hint', [
      transition(`* => slideInDown`, [animate('500ms ease-in', slideInDown())]),
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
  @Input() isActiveRound: boolean = false;
  @Input() isNewGame: boolean = false;
  @Input() letter!: string;
  @Input() shouldBounce: boolean = false;
  @Input() shouldFlip: boolean = false;
  @Output() bounced = new EventEmitter();

  guessFeedback: string = '';
  hint: string = '';
  isHintVisible: boolean = false;

  // broadcast that the winning tile jump animation is complete
  tileBounced(event: AnimationEvent): void {
    if (event.toState === bounceTrigger) {
      this.bounced.emit(event);
    }
  }

  onHintDisplayed(event: AnimationEvent): void {
    this.isHintVisible = event.phaseName === 'done';
  }

  ngOnChanges(changes: SimpleChanges): void {
    const guess = changes.guess?.currentValue;

    if (guess?.hasRevealedHint) {
      this.hint = guess.correctLetter;
    }

    if (this.isNewGame) {
      this.guessFeedback = '';
      this.hint = '';
      this.isHintVisible = false;
    }

    if (changes.shouldFlip?.currentValue) {
      // tiles are ready to be painted and revealed
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

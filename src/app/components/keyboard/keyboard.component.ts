import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { GuessService } from '@app/services/guess/guess.service';
import { SpecialKeysEnum } from '@app/ts/enums';
import { IGuess, IKeyBoard } from '@app/ts/interfaces';
import { isModalOpen } from '@app/utils/is-modal-open.utils';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
})
export class KeyboardComponent implements OnInit {
  @Input() isBoardLocked: boolean = false;
  @Output() keyPress = new EventEmitter();

  activeKey: string = '';
  keyboard = [];
  specialKeys = {
    backspace: SpecialKeysEnum.Backspace,
    hint: SpecialKeysEnum.Hint,
    enter: SpecialKeysEnum.Enter,
  };

  constructor(private _guessSvc: GuessService) {}

  ngOnInit(): void {
    this._guessSvc.guess$.subscribe((data: IKeyBoard) => {
      // creates array of arrays based on common obj property (i.e. row number)
      const groupedObj: any = Object.values(data).reduce(
        (prev: any, current: any) => {
          const prop = current['row'];
          prev[prop] = prev[prop] ?? [];
          prev[prop].push(current);
          return prev;
        },
        []
      );
      // clean up empty array item(s)
      this.keyboard = groupedObj.filter((el: any) => el != null);
    });
  }

  // *ngFor trackBy trackers
  keyTracker = (index: number, key: IGuess): string | number =>
    key.value || index;
  rowTracker = (index: number): number => index;

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.isBoardLocked) {
      return;
    }

    const isTabKey = this.activeKey === SpecialKeysEnum.Tab;

    // don't interfere with keyboard navigation
    if (isTabKey || (isTabKey && event.shiftKey) || isModalOpen()) {
      return;
    }

    this.activeKey = event.key.toLowerCase();
    // quickly deactivate the key to create a 'ghost typing' effect in the keyboard UI
    const timeToDeactivate = 100;
    setTimeout(() => {
      this.activeKey = '';
    }, timeToDeactivate);

    this.keyPress.emit(this.activeKey);
  }
}

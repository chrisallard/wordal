import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
})
export class KeyboardComponent implements OnChanges {
  @Input() usedKeys: any;
  @Output() keyPress = new EventEmitter();

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key.toUpperCase();
    const isTabKey = key === 'TAB';

    // don't interfere with keyboard navigation
    if (isTabKey || (isTabKey && event.shiftKey)) {
      return;
    }

    this.keyPress.emit(key);
  }

  private _getModel() {
    return [
      [
        { value: 'q', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'w', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'e', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'r', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 't', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'y', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'u', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'i', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'o', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'p', isCorrect: false, isInAnswer: false, wasUsed: false },
      ],
      [
        { value: 'a', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 's', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'd', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'f', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'g', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'h', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'j', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'k', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'l', isCorrect: false, isInAnswer: false, wasUsed: false },
      ],
      [
        { value: 'enter' },
        { value: 'z', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'x', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'c', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'v', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'b', isCorrect: false, isInAnswer: false, wasUsed: false },
        { value: 'n', isCorrect: false, isInAnswer: false, wasUsed: false },
        {
          value: 'm',
          isCorrect: false,
          isInAnswer: false,
          wasUsed: false,
        },
        { value: 'backspace' },
      ],
    ];
  }

  keyboardRows = this._getModel();

  ngOnChanges(changes: SimpleChanges): void {
    const usedLetters = changes['usedKeys'];
    if (usedLetters && usedLetters.currentValue) {
      if (usedLetters.currentValue.length) {
        usedLetters.currentValue.forEach((letter: string) => {
          // format is: character : is correct (as 1 or 0) : is in answer (as 1 or 0) (e.g. 'P:1:0')
          const a = letter.split(':');

          const character = a[0].toLowerCase();
          const isCorrect = parseInt(a[1]);
          const isInAnswer = parseInt(a[2]);

          // run through the keyboard's rows
          for (let i = 0; i < this.keyboardRows.length; i = i + 1) {
            // run through the keyboard's row's keys
            for (let j = 0; j < this.keyboardRows[i].length; j = j + 1) {
              if (this.keyboardRows[i][j].value === character) {
                this.keyboardRows[i][j].wasUsed = true;
                this.keyboardRows[i][j].isCorrect =
                  isCorrect == 1 ? true : false;

                this.keyboardRows[i][j].isInAnswer =
                  isInAnswer == 1 ? true : false;
              }
            }
          }
        });
      } else {
        // new game - reset model
        this.keyboardRows = this._getModel();
      }
    }
  }
}

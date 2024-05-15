import { trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getKeyColorAnimation } from '@app/animations/key-color.animation';
import { GuessFeedbackEnum, SpecialKeysEnum } from '@app/ts/enums';

@Component({
  selector: 'app-keyboard-btn',
  templateUrl: './keyboard-btn.component.html',
  styleUrls: ['./keyboard-btn.component.scss'],
  animations: [trigger('keyColor', getKeyColorAnimation())],
})
export class KeyboardBtnComponent implements OnInit {
  @Input() isActive: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() key: any;
  @Input() shouldFocus: boolean = false;
  @Output() press = new EventEmitter();

  isEnterKey: boolean = false;
  isHintKey: boolean = false;
  isIconKey: boolean = false;

  ngOnInit(): void {
    const key = this.key.value;

    this.isHintKey = key === SpecialKeysEnum.Hint;
    this.isEnterKey = key === SpecialKeysEnum.Enter;

    this.isIconKey =
      key === SpecialKeysEnum.Refresh ||
      key === SpecialKeysEnum.Backspace ||
      this.isHintKey;
  }

  keyPress(): void {
    this.press.emit(this.key);
  }

  getAriaLabel(): string {
    let label = '';

    if (this.isIconKey) {
      label = this.key.label;
    }

    if (this.key.state !== GuessFeedbackEnum.Unused) {
      // ex: aria-label=("Q PRESENT" || "W ABSENT" || "E CORRECT")
      label = `${this.key.value} ${this.key.state}`;
    }

    return label.toUpperCase();
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-keyboard-btn',
  templateUrl: './keyboard-btn.component.html',
  styleUrls: ['./keyboard-btn.component.scss'],
})
export class KeyboardBtnComponent implements OnInit {
  @Input() key: any;
  @Output() press = new EventEmitter();

  isBackspace: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.isBackspace = this.key.value.toUpperCase() === 'BACKSPACE';
  }

  pressed() {
    this.press.emit(this.key);
  }
}

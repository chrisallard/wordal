import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-icon-btn',
  templateUrl: './icon-btn.component.html',
  styleUrls: ['./icon-btn.component.scss'],
})
export class IconBtnComponent {
  @Input() label: string = '';
  @Input() iconName: string = '';
  @Output() press = new EventEmitter();
}

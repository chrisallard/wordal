import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() label: string = '';
  @Input() modalTitle: string = '';
  @Input() tagline: string = '';
  @Output() close = new EventEmitter();
}

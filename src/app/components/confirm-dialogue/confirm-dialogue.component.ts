import { Component } from '@angular/core';
import { ISimpleMessage } from '@app/ts/interfaces';
import { SimpleModalComponent } from 'ngx-simple-modal';

@Component({
  selector: 'app-confirm-dialogue',
  templateUrl: './confirm-dialogue.component.html',
  styleUrls: ['./confirm-dialogue.component.scss'],
})
export class ConfirmDialogueComponent
  extends SimpleModalComponent<ISimpleMessage, boolean>
  implements ISimpleMessage
{
  message: string = '';
  title: string = '';

  constructor() {
    super();
  }

  confirm(isConfirmed: boolean): void {
    this.result = isConfirmed;
    this.close();
  }
}

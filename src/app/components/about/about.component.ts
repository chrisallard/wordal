import { Component } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent extends SimpleModalComponent<null, boolean> {
  constructor() {
    super();
  }
}

import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss'],
})
export class InstructionsComponent
  extends SimpleModalComponent<undefined, undefined>
  implements OnInit
{
  shouldFlipTiles: boolean = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    // delay example tile flip transition
    const timeToDelayTileFlip = 1000;
    setTimeout(() => {
      this.shouldFlipTiles = true;
    }, timeToDelayTileFlip);
  }
}

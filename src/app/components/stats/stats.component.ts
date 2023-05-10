import { Component, OnInit } from '@angular/core';
import { StorageService } from '@app/services/storage/storage.service';
import { IStoredData } from '@app/ts/interfaces';
import { SimpleModalComponent } from 'ngx-simple-modal';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent
  extends SimpleModalComponent<
    {
      shouldShowWinner: boolean;
    },
    boolean
  >
  implements OnInit
{
  data: IStoredData | null = null;
  shouldIndicateWinningRound: boolean = false;
  constructor(private _storageSvc: StorageService) {
    super();
  }

  ngOnInit(): void {
    this.data = this._storageSvc.getLocalStorageData();
  }
}

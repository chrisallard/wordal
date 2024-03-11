import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from '@app/services/analytics/google-analytics.service';
import { ModalService } from '@app/services/modal/modal.service';
import { StorageService } from '@app/services/storage/storage.service';
import { IGameSummary, IStoredData } from '@app/ts/interfaces';
import { SimpleModalComponent } from 'ngx-simple-modal';

import { ModalNameEnum } from '@app/ts/enums';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent
  extends SimpleModalComponent<IGameSummary, boolean>
  implements OnInit
{
  fastestWinTime: string = '';
  gameTime: string = '';
  message: string = '';
  solution: string = '';
  storedLocalData: IStoredData | null = null;
  numSessionWins: number = 0;
  title: string = '';
  wasGameWon: boolean = false;

  private _shouldCloseOtherModals = false;
  constructor(
    private _analytics: GoogleAnalyticsService,
    private _modalSvc: ModalService,
    private _storageSvc: StorageService
  ) {
    super();
  }

  ngOnInit(): void {
    const zeroWins = 0;
    this.storedLocalData = this._storageSvc.getLocalStorageData();
    this.numSessionWins = this._storageSvc.getSessionData() || zeroWins;

    this.title = this.wasGameWon ? 'Great Job!' : 'Better Luck Next Time';
    this.message = this.wasGameWon
      ? `You solved the puzzle in ${this.gameTime}`
      : `You ran out of guesses`;
  }

  showDef(): void {
    this._modalSvc.openModal(
      ModalNameEnum.Definition,
      { word: this.solution },
      this._shouldCloseOtherModals
    );
  }

  showStats(): void {
    this._analytics.gaCaptureModalOpen(ModalNameEnum.Stats);

    this._modalSvc.openModal(
      ModalNameEnum.Stats,
      { shouldIndicateWinningRound: true },
      this._shouldCloseOtherModals
    );
  }

  newGame(): void {
    this.result = true;
    this.close();
  }
}

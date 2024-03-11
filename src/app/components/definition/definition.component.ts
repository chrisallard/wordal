import { Component, OnInit } from '@angular/core';
import { API_TIMEOUT_DURATION } from '@app/config/app.config';
import { GoogleAnalyticsService } from '@app/services/analytics/google-analytics.service';
import { VerifyWordService } from '@app/services/verify-word/verify-word.service';
import { ModalNameEnum } from '@app/ts/enums';
import { IDictionaryItem, IWord } from '@app/ts/interfaces';
import { SimpleModalComponent } from 'ngx-simple-modal';

@Component({
  selector: 'app-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.scss'],
})
export class DefinitionComponent
  extends SimpleModalComponent<IWord, boolean>
  implements OnInit, IWord
{
  word: string = '';
  phonetic: string = '';
  definitions!: IDictionaryItem[];
  isOffline: boolean = false;
  metLatencyThreshold = false;

  constructor(
    private _verifyWordSvc: VerifyWordService,
    private _analyticsSvc: GoogleAnalyticsService
  ) {
    super();
  }

  ngOnInit(): void {
    this._analyticsSvc.gaCaptureModalOpen(ModalNameEnum.Definition);

    let didApiRespond = false;

    const verifySub = this._verifyWordSvc.verifyWord(this.word).subscribe({
      next: (definitions: IDictionaryItem[]) => {
        didApiRespond = true;
        this.phonetic = definitions[0].phonetic || this.phonetic;
        this.definitions = definitions;
      },
      error: () => {
        didApiRespond = true;

        if (!window.navigator.onLine) {
          this.isOffline = true;
        }
      },
    });

    setTimeout(() => {
      if (!didApiRespond) {
        verifySub.unsubscribe();
        this.metLatencyThreshold = true;
      }
    }, API_TIMEOUT_DURATION);
  }
}

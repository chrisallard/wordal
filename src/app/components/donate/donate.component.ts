import { Component, OnInit } from '@angular/core';
import { DONATION_URL } from '@app/config/app.config';
import { GoogleAnalyticsService } from '@app/services/analytics/google-analytics.service';
import { ModalNameEnum } from '@app/ts/enums';
import { ISimpleMessage } from '@app/ts/interfaces';
import { SimpleModalComponent } from 'ngx-simple-modal';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
})
export class DonateComponent
  extends SimpleModalComponent<ISimpleMessage, boolean>
  implements OnInit
{
  donationUrl = DONATION_URL;
  message: string = '';
  title: string = '';

  constructor(private _analyticsSvc: GoogleAnalyticsService) {
    super();
  }

  ngOnInit(): void {
    this._analyticsSvc.gaCaptureModalOpen(ModalNameEnum.Stats);
  }

  exit(caller: string): void {
    this._analyticsSvc.gaCaptureAnalyticsEvent('donation_modal_closed', {
      close_method: caller,
    });

    this.close();
  }
}

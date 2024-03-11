import { Injectable } from '@angular/core';
import { ModalNameEnum } from '@app/ts/enums';
import { environment } from 'src/environments/environment';

declare let gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  gaCaptureAnalyticsEvent(eventName: string, eventParams: object = {}) {
    // only broadcast events in prod
    if (!environment.production) {
      return;
    }

    // safety net in case that the global 'gtag' isn't registered
    try {
      gtag('event', eventName, eventParams);
    } catch (error) {
      console.error(error);
    }
  }

  gaCaptureModalOpen(modal_name: ModalNameEnum) {
    this.gaCaptureAnalyticsEvent('modal_open', {
      modal_name,
    });
  }
}

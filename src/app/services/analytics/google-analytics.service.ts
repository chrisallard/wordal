import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare let gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  gaCaptureAnalyticsEvent({
    eventName,
    eventCategory,
    eventAction,
    eventLabel,
    eventValue,
  }: {
    eventName?: string;
    eventCategory?: string;
    eventAction?: string;
    eventLabel?: string | null;
    eventValue?: number | null;
  }) {
    // only broadcast events in prod
    if (!environment.production) {
      return;
    }

    if (!eventName) {
      return console.warn('No analytics event name provided.');
    }

    // safety net in case that the global 'gtag' isn't registered
    try {
      gtag('event', eventName, {
        eventAction,
        eventCategory,
        eventLabel,
        eventValue,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

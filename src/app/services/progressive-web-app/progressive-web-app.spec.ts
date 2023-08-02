import { Location } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ProgressiveWebApp,
  currentPagePos,
  updateFlag,
} from '@services/progressive-web-app/progressive-web-app.service';

describe('ProgressiveWebApp', () => {
  let pwa: ProgressiveWebApp;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });

    router = TestBed.inject(Router);
    pwa = TestBed.inject(ProgressiveWebApp);
    location = TestBed.inject(Location);
  });

  describe('checkForUpdate', () => {
    it('should be true if the updated flag query param is present', fakeAsync(() => {
      pwa.hasUpdateFlag$.subscribe((isPresent) => {
        expect(isPresent).toBeTrue();
      });

      pwa.checkForUpdateFlag();

      router.navigate([''], {
        queryParams: {
          [updateFlag.label]: updateFlag.value,
        },
      });
      tick();
    }));

    it('should be false if the updated flag query param is not present', fakeAsync(() => {
      pwa.hasUpdateFlag$.subscribe((isPresent) => {
        expect(isPresent).toBeFalse();
      });
      pwa.checkForUpdateFlag();

      router.navigate([''], {
        queryParams: {},
      });
      tick();
    }));

    it('should remove the flag if present', fakeAsync(() => {
      pwa.hasUpdateFlag$.subscribe((isPresent) => {
        if (isPresent) {
          tick();
          expect(location.path()).not.toContain(
            `${updateFlag.label}=${updateFlag.value}`
          );
        }
      });

      pwa.checkForUpdateFlag();

      router.navigate([''], {
        queryParams: {
          [updateFlag.label]: updateFlag.value,
        },
      });
      tick();
    }));
  });

  describe('reloadWindow', () => {
    it('should reload the window with a query param', fakeAsync(() => {
      spyOn(location, 'historyGo');

      pwa.reloadWindow();
      tick();

      expect(location.path()).toContain(
        `${updateFlag.label}=${updateFlag.value}`
      );
      expect(location.historyGo).toHaveBeenCalledWith(currentPagePos);
    }));
  });
});

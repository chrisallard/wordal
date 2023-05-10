import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ProgressiveWebApp } from '@services/progressive-web-app/progressive-web-app.service';
import { of } from 'rxjs';
describe('ProgressiveWebApp', () => {
  let pwa: ProgressiveWebApp;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgressiveWebApp,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
      ],
    });

    pwa = TestBed.inject(ProgressiveWebApp);
  });

  describe('checkForUpdate', () => {
    it('should be true if the updated flag query param is present', () => {
      TestBed.inject(ActivatedRoute).queryParams = of({ updated: true });

      pwa.hasUpdateFlag$.subscribe((isPresent) => {
        console.log(isPresent);
        expect(isPresent).toBeTrue();
      });
      pwa.checkForUpdateFlag();
    });

    it('should be false if the updated flag query param is not present', () => {
      TestBed.inject(ActivatedRoute).queryParams = of({});

      pwa.hasUpdateFlag$.subscribe((isPresent) => {
        expect(isPresent).toBeFalse();
      });
      pwa.checkForUpdateFlag();
    });

    it('should remove the flag if present', () => {
      TestBed.inject(ActivatedRoute).queryParams = of({ updated: true });

      pwa.hasUpdateFlag$.subscribe((isPresent) => {
        if (isPresent) {
          expect(window.location.search).toEqual('');
        }
      });

      pwa.checkForUpdateFlag();
    });
  });

  describe('reloadWindow', () => {
    // it('should reload the window with a query param', () => {
    //   const flag = 'updated=true';
    //   expect(window.location.href).not.toContain(flag);
    //   console.log('loc: ', window.location.href);
    //   pwa.reloadWindow();
    //   console.log('loc2: ', window.location.href);
    //   expect(window.location.href).toContain(flag);
    // });
  });
});

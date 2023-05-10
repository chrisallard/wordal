import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgressiveWebApp {
  hasUpdateFlag$ = new Subject<boolean>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}

  checkForUpdateFlag(): void {
    const isAllDone$ = new Subject<boolean>();

    const finish = () => {
      isAllDone$.next(true);
      isAllDone$.complete();
      this.hasUpdateFlag$.complete();
    };

    this._router.events.pipe(takeUntil(isAllDone$)).subscribe((event) => {
      // this check prevents an initial empty {} queryParams from coming through
      if (event instanceof NavigationEnd) {
        this._activatedRoute.queryParams
          .pipe(takeUntil(isAllDone$))
          .subscribe((params) => {
            if (params?.updated) {
              // remove flag from query string to prevent the message showing again on refresh
              this._router.navigate([], {
                queryParams: {
                  updated: null,
                },
                queryParamsHandling: 'merge',
              });

              this.hasUpdateFlag$.next(true);
              finish();
            } else {
              this.hasUpdateFlag$.next(false);
              finish();
            }
          });
      }
    });
  }

  reloadWindow(): void {
    window.location.href = `${window.location.href}?updated=true`;
  }
}

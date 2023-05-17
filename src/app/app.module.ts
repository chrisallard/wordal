import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from '@app/app.component';
import { KeyboardBtnComponent } from '@app/components/keyboard/keyboard-btn/keyboard-btn.component';
import { StatsComponent } from '@app/components/stats/stats.component';
import { SummaryComponent } from '@app/components/summary/summary.component';
import { MODAL_BODY_CLASS } from '@app/config/app.config';
import { AboutComponent } from '@components/about/about.component';
import { IconBtnComponent } from '@components/buttons/icon-btn/icon-btn.component';
import { ConfirmDialogueComponent } from '@components/confirm-dialogue/confirm-dialogue.component';
import { DefinitionComponent } from '@components/definition/definition.component';
import { DonateComponent } from '@components/donate/donate.component';
import { InstructionsComponent } from '@components/instructions/instructions.component';
import { KeyboardComponent } from '@components/keyboard/keyboard.component';
import { ModalComponent } from '@components/modal/modal.component';
import { RotationLockComponent } from '@components/rotation-lock/rotation-lock.component';
import { SideNavComponent } from '@components/side-nav/side-nav.component';
import { TileComponent } from '@components/tile/tile.component';
import { ConfettiCannonDirective } from '@directives/confetti-cannon.directive';
import { TrapFocusDirective } from '@directives/trap-focus.directive';
import { GoogleAnalyticsService } from '@services/analytics/google-analytics.service';
import { ConfettiService } from '@services/confetti/confetti.service';
import { defaultSimpleModalOptions, SimpleModalModule } from 'ngx-simple-modal';
import { ToastrModule } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    ConfettiCannonDirective,
    ConfirmDialogueComponent,
    DefinitionComponent,
    DonateComponent,
    IconBtnComponent,
    InstructionsComponent,
    KeyboardBtnComponent,
    KeyboardComponent,
    ModalComponent,
    SideNavComponent,
    StatsComponent,
    SummaryComponent,
    TileComponent,
    TrapFocusDirective,
    RotationLockComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ToastrModule.forRoot({
      includeTitleDuplicates: true,
      positionClass: 'toast-center',
      preventDuplicates: true,
    }),
    RouterModule.forRoot([]),
    SimpleModalModule.forRoot(
      { container: 'modal-container' },
      {
        ...defaultSimpleModalOptions,
        ...{
          animationDuration: 400,
          bodyClass: MODAL_BODY_CLASS,
          closeOnClickOutside: false,
          closeOnEscape: true,
          wrapperClass: 'in',
          wrapperDefaultClasses: 'modal fade-anim',
        },
      }
    ),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  entryComponents: [],
  providers: [ConfettiService, GoogleAnalyticsService],
  bootstrap: [AppComponent],
})
export class AppModule {}

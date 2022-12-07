import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from '@app/app.component';
import { KeyboardBtnComponent } from '@components/keyboard-btn/keyboard-btn.component';
import { AutoFocusDirective } from '@directives/auto-focus.directive';
import { ConfettiService } from '@services/confetti.service';
import { KeyboardComponent } from './components/keyboard/keyboard.component';

@NgModule({
  declarations: [
    AppComponent,
    AutoFocusDirective,
    KeyboardBtnComponent,
    KeyboardComponent,
  ],
  imports: [BrowserAnimationsModule, BrowserModule, HttpClientModule],
  providers: [ConfettiService],
  bootstrap: [AppComponent],
})
export class AppModule {}

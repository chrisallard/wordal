import { AnimationEvent, trigger } from '@angular/animations';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import {
  animState,
  navWidth,
  toggleSideNav,
} from '@app/animations/toggle-side-nav.animation';
import { SIDE_NAV_BODY_CLASS } from '@app/config/app.config';
import { GoogleAnalyticsService } from '@app/services/analytics/google-analytics.service';
import { ModalService } from '@app/services/modal/modal.service';
import { ModalNameEnum, SpecialKeysEnum } from '@app/ts/enums';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  animations: [trigger('sideNav', toggleSideNav('.side-nav'))],
})
export class SideNavComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter();

  modalName = { ...ModalNameEnum };
  sideNavWidth = `${navWidth}px`;
  state = animState;

  donationMsg = {
    title: 'Wow, You Rock!',
    message: 'Thanks for the consideration.',
  };

  constructor(
    private _analytics: GoogleAnalyticsService,
    private _modalSvc: ModalService,
    private _renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // add class to body when open
    if (changes?.isOpen?.currentValue) {
      this._renderer.addClass(document.body, SIDE_NAV_BODY_CLASS);
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key.toLowerCase() === SpecialKeysEnum.Esc && this.isOpen) {
      this.isOpen = false;
    }
  }

  sideNavClosed(event: AnimationEvent): void {
    if (
      event.toState === this.state.closed &&
      event.fromState === this.state.open
    ) {
      this._renderer.removeClass(document.body, SIDE_NAV_BODY_CLASS);
      this.closed.emit();
    }
  }

  openModal(modalName: ModalNameEnum, args?: object): void {
    this._analytics.gaCaptureModalOpen(modalName);
    this._modalSvc.openModal(modalName, args);
  }
}

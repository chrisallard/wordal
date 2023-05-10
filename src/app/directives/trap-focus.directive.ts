import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SpecialKeysEnum } from '@app/ts/enums';

@Directive({
  selector: '[trapFocus]',
})
export class TrapFocusDirective implements OnInit, OnDestroy {
  private _firstFocusableElm!: HTMLElement;
  private _finalFocusableElm!: HTMLElement;
  private _lastFocusedElm!: HTMLElement;

  constructor(private _el: ElementRef) {}

  ngOnInit(): void {
    this._lastFocusedElm = document.activeElement as HTMLElement;
    const allFocusableElms = this._el.nativeElement.querySelectorAll(
      `a[href],
       button,
       textarea,
       input[type="text"],
       input[type="radio"],
       input[type="checkbox"],
       select`
    );
    this._firstFocusableElm = allFocusableElms[0];
    this._finalFocusableElm = allFocusableElms[allFocusableElms.length - 1];

    setTimeout(() => {
      this._firstFocusableElm.focus();
    }, 100);
  }

  ngOnDestroy(): void {
    // return focus back to where it was previously
    this._lastFocusedElm.focus();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // only pay attention to tab navigation
    if (event.key.toLowerCase() !== SpecialKeysEnum.Tab) return;

    // SHIFT + TAB === going backwards
    if (event.shiftKey) {
      // we hit the first focusable item, send them to the last item
      if (document.activeElement === this._firstFocusableElm) {
        this._finalFocusableElm.focus();
        event.preventDefault();
      }
    } else {
      // TAB only === going forwards
      // we hit the last focusable item, send them to the first item
      if (document.activeElement === this._finalFocusableElm) {
        this._firstFocusableElm.focus();
        event.preventDefault();
      }
    }
  }
}

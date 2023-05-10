import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpecialKeysEnum } from '@app/ts/enums';
import { TrapFocusDirective } from './trap-focus.directive';

@Component({
  template: ` <div>
    <button type="button" class="focus-elms" id="0"></button>
    <div trapFocus *ngIf="shouldDisplay">
      <div>You shouldn't focus on me!</div>
      <textarea class="focus-elms" id="1"></textarea>
      <a href="" class="focus-elms" id="2"></a>
      <input type="text" class="focus-elms" id="3" />
      <div>Me either.</div>
    </div>
  </div>`,
})
class TestComponent {
  shouldDisplay = true;
}

describe('TrapFocusDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let focusableElms: DebugElement[];

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TrapFocusDirective, TestComponent],
    }).createComponent(TestComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();

    focusableElms = fixture.debugElement.queryAll(By.css('.focus-elms'));
    focusableElms[0].nativeElement.focus();
    // start with focus outside of directive
    expect(document.activeElement).toEqual(focusableElms[0].nativeElement);

    component.shouldDisplay = false;
    fixture.detectChanges();

    jasmine.clock().uninstall();
    jasmine.clock().install();

    component.shouldDisplay = true;
    fixture.detectChanges();

    // wait for setTimout to fire
    jasmine.clock().tick(200);
  });

  it('should focus the first element', () => {
    expect(document.activeElement).toEqual(focusableElms[1].nativeElement);
  });

  it('should return focus when destroyed', () => {
    expect(document.activeElement).toEqual(focusableElms[1].nativeElement);

    component.shouldDisplay = false;
    fixture.detectChanges();

    expect(document.activeElement).toEqual(focusableElms[0].nativeElement);
  });

  it('should focus the last item from the first', () => {
    expect(document.activeElement).toEqual(focusableElms[1].nativeElement);
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: SpecialKeysEnum.Tab, shiftKey: true })
    );
    expect(document.activeElement).toEqual(focusableElms[3].nativeElement);
  });

  it('should focus the first item from the last', () => {
    // send focus to last focusable elm
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: SpecialKeysEnum.Tab,
        shiftKey: true,
      })
    );

    // confirm we're on the last focusable elm
    expect(document.activeElement).toEqual(focusableElms[3].nativeElement);

    // tab while focused on last focusable elm
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: SpecialKeysEnum.Tab })
    );

    // should send us to the first
    expect(document.activeElement).toEqual(focusableElms[1].nativeElement);
  });

  it('should ignore non-tab keys', () => {
    expect(document.activeElement).toEqual(focusableElms[1].nativeElement);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));

    // focus elm should not have changed
    expect(document.activeElement).toEqual(focusableElms[1].nativeElement);
  });
});

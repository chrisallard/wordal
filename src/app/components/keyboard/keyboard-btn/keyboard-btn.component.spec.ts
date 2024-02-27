import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeyboardBtnComponent } from '@components/keyboard/keyboard-btn/keyboard-btn.component';

describe('KeyboardBtnComponent', () => {
  let component: KeyboardBtnComponent;
  let fixture: ComponentFixture<KeyboardBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [KeyboardBtnComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardBtnComponent);
    component = fixture.componentInstance;
    component.key = { value: 'q' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

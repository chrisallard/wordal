import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardBtnComponent } from './keyboard-btn.component';

describe('KeyboardBtnComponent', () => {
  let component: KeyboardBtnComponent;
  let fixture: ComponentFixture<KeyboardBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyboardBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

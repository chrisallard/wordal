import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotationLockComponent } from './rotation-lock.component';

describe('RotationLockComponent', () => {
  let component: RotationLockComponent;
  let fixture: ComponentFixture<RotationLockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RotationLockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RotationLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

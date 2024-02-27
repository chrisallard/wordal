import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateComponent } from '@components/donate/donate.component';
import { ModalComponent } from '@components/modal/modal.component';

describe('DonateComponent', () => {
  let component: DonateComponent;
  let fixture: ComponentFixture<DonateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DonateComponent, ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DonateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

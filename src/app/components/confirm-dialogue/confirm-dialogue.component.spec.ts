import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogueComponent } from '@components/confirm-dialogue/confirm-dialogue.component';
import { ModalComponent } from '@components/modal/modal.component';

describe('ConfirmDialogueComponent', () => {
  let component: ConfirmDialogueComponent;
  let fixture: ComponentFixture<ConfirmDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogueComponent, ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

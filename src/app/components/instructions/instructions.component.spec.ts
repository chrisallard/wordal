import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionsComponent } from '@components/instructions/instructions.component';
import { ModalComponent } from '@components/modal/modal.component';

describe('InstructionsComponent', () => {
  let component: InstructionsComponent;
  let fixture: ComponentFixture<InstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructionsComponent, ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

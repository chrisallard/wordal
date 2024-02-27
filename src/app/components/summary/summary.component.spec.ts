import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconBtnComponent } from '@components/buttons/icon-btn/icon-btn.component';
import { ModalComponent } from '@components/modal/modal.component';
import { SummaryComponent } from '@components/summary/summary.component';
import { SimpleModalService } from 'ngx-simple-modal';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [SimpleModalService],
      declarations: [SummaryComponent, IconBtnComponent, ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

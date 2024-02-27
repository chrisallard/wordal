import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefinitionComponent } from '@components/definition/definition.component';
import { ModalComponent } from '@components/modal/modal.component';

describe('DefinitionComponent', () => {
  let component: DefinitionComponent;
  let fixture: ComponentFixture<DefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DefinitionComponent, ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

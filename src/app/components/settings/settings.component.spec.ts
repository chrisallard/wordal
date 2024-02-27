import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StorageService } from '@app/services/storage/storage.service';
import { SettingsTypeEnum } from '@app/ts/enums';
import { ModalComponent } from '@components/modal/modal.component';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let storageSvcSpy: jasmine.SpyObj<StorageService>;

  beforeEach(async () => {
    storageSvcSpy = jasmine.createSpyObj('StorageService', [
      'getLocalStorageData',
    ]);
    storageSvcSpy.getLocalStorageData.and.returnValue({
      settings: {
        [SettingsTypeEnum.HardMode]: true,
      },
      stats: {},
    });

    await TestBed.configureTestingModule({
      declarations: [SettingsComponent, ModalComponent],
      providers: [{ provide: StorageService, useValue: storageSvcSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

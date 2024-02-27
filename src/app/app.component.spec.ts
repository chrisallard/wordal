import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from '@app/app.component';
import { KeyboardComponent } from '@components/keyboard/keyboard.component';
import { RotationLockComponent } from '@components/rotation-lock/rotation-lock.component';
import { SideNavComponent } from '@components/side-nav/side-nav.component';
import { SimpleModalService } from 'ngx-simple-modal';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('SimpleModalService', [
      'addModal',
      'removaAll',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ServiceWorkerModule.register('', { enabled: false }),
      ],
      declarations: [
        AppComponent,
        RotationLockComponent,
        SideNavComponent,
        KeyboardComponent,
      ],
      providers: [
        {
          provide: SimpleModalService,
          useValue: modalSpy,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { SimpleModalService } from 'ngx-simple-modal';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

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
      ],
      declarations: [AppComponent],
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
        {
          provide: SwUpdate,
          useValue: {
            isEnabled: true,
            checkForUpdate: Promise.resolve(),
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

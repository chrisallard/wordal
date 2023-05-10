import { TestBed } from '@angular/core/testing';
import {
  MakeToast,
  sampleToastMsg,
  toastrConfig,
} from '@services/make-toast/make-toast.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('makeToast', () => {
  let toastrService: jasmine.SpyObj<ToastrService>;
  let toastr: MakeToast;
  let mockToast: {
    header?: string;
    message?: string;
    options?: object;
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ToastrService', ['success']);

    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()],
      providers: [MakeToast, { provide: ToastrService, useValue: spy }],
    });

    toastr = TestBed.inject(MakeToast);

    toastrService = TestBed.inject(
      ToastrService
    ) as jasmine.SpyObj<ToastrService>;

    mockToast = {
      header: 'My Header',
      message: 'Hello world.',
      options: {},
    };
  });

  it('should call the toastr svc with default args if none provided', () => {
    toastr.makeToast({});
    expect(toastrService.success).toHaveBeenCalledWith(
      '',
      sampleToastMsg,
      toastrConfig
    );
  });

  it('should call the toastr svc with the passed args', () => {
    toastr.makeToast(mockToast);
    expect(toastrService.success).toHaveBeenCalledWith(
      mockToast.header,
      mockToast.message,
      toastrConfig
    );
  });

  it('should allow for option overrides', () => {
    const timeOutOverride = { timeOut: 2000 };

    toastr.makeToast({
      ...mockToast,
      options: timeOutOverride,
    });

    expect(toastrService.success).toHaveBeenCalledWith(
      mockToast.header,
      mockToast.message,
      { ...toastrConfig, ...timeOutOverride }
    );
  });
});

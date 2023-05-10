import { Injectable } from '@angular/core';
import { ActiveToast, ToastrService } from 'ngx-toastr';

export const toastrConfig = {
  timeOut: 1500,
  toastClass: 'toasty',
  titleClass: 'toasty-title',
  messageClass: 'toasty-message',
};

export const sampleToastMsg = 'Sample Message.';

@Injectable({
  providedIn: 'root',
})
export class MakeToast {
  constructor(private _toastrSvc: ToastrService) {}

  makeToast({
    header = '',
    message = sampleToastMsg,
    options = {},
  }): ActiveToast<any> {
    const config = {
      timeOut: 1500,
      toastClass: 'toasty',
      titleClass: 'toasty-title',
      messageClass: 'toasty-message',
    };

    return this._toastrSvc.success(header, message, {
      ...config,
      ...options,
    });
  }
}

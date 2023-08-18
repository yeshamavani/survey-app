import {Component, OnInit} from '@angular/core';
import {Toast, ToastrService, ToastPackage} from 'ngx-toastr';
import {ToastType} from './models/toast-type.enum';

@Component({
  selector: 'rpms-custom-toastr',
  templateUrl: './custom-toastr.component.html',
  styleUrls: ['./custom-toastr.component.scss'],
  preserveWhitespaces: false,
})
export class CustomToastrComponent extends Toast implements OnInit {
  toastType: ToastType;
  ToastType = ToastType;

  constructor(
    protected override toastrService: ToastrService,
    public override toastPackage: ToastPackage,
  ) {
    super(toastrService, toastPackage);
  }
  ngOnInit(): void {
    this.toastType = this.toastPackage.toastType as ToastType;
  }

  close() {
    this.toastrService.clear(this.toastPackage.toastId);
  }
}

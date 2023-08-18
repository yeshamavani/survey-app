import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ComponentBase} from '../../../core/component-base';
import {ToastrService} from 'ngx-toastr';

export interface CopyLinkDialogData {
  title: string;
  link: string;
  /**
   * @default 'Copy Link'
   */
  confirmTitle?: string;
  /**
   * @default 'Close'
   */
  cancelTitle?: string;
  successMsg?: string;
}
@Component({
  templateUrl: './copy-link-dialog.component.html',
  styleUrls: ['./copy-link-dialog.component.scss'],
})
export class CopyLinkDialogComponent extends ComponentBase {
  @ViewChild('fieldToCopy', {read: ElementRef}) fieldToCopy: { nativeElement: { querySelector: (arg0: string) => { (): any; new(): any; select: { (): void; new(): any; }; }; }; };

  constructor(
    public dialogRef: MatDialogRef<CopyLinkDialogComponent>,
    private readonly toastrService: ToastrService,
    
    @Inject(MAT_DIALOG_DATA) public dialogData: CopyLinkDialogData,
  ) {
    super();
  }


  onConfirmation(): void {
    this.copy();
    this.dialogRef.close();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  copy() {
    this.fieldToCopy.nativeElement.querySelector('input').select();
    document.execCommand('copy'); //NOSONAR
    this.toastrService.success(
      this.dialogData.successMsg || 'Link Copied Successfully'  
    );
  }
}

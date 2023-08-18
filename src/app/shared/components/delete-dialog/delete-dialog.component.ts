import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

interface DailogObj {
  dialogMsg: string;
  dialogNote: string;
  deleteLbl: string;
  dialogWarning?: string;
  yesLabel?: string;
  noLabel?: string;
  warningIcon?: boolean;
}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
  constructor(
    protected readonly dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DailogObj,
  ) {
    // If any dialog note is required in same line with dialog message and without in bold,
    // then replace {value} in dialog note while passing it in deleteComponent.
    if (data.dialogMsg.includes('{value}') && data.dialogNote) {
      data.dialogMsg = data.dialogMsg.replace(
        '{value}',
        `<br><b>${data.dialogNote}</b>`,
      );
      data.dialogNote = '';
    }
  }

  ngOnInit() {
    const msgElement = document.getElementById('dialog-msg');
    if(msgElement){
      msgElement.innerHTML = this.data.dialogMsg;
    }
  }

  delete() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close();
  }
}

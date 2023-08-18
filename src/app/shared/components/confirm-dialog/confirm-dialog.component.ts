import { OnInit, Inject, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  noWhitespace,
  specialCharacterValidatorAllowingANDandPercentage,
} from '../../functions/validation.service';

export enum ConfirmationAction {
  WARNING = 'warning',
  CHECK = 'check',
  CLOSE = 'close',
  DELETE = 'delete',
  EDIT = 'edit',
  TRANSFER = 'transfer',
}

interface DialogObj {
  dialogMsg: string;
  dialogNote: string;
  footerNote: string;
  cycleDate: string;
  warningMsg: string;
  confirmationIcon: ConfirmationAction;
  labelName?: string;
  inputType?: 'text' | 'area' | 'number';
  defaultValue?: string;
  required?: boolean;
  customErrorMessage?: string;
  showInputField?: boolean;
  fieldLength?: number;
  max?: number;
  showCharCount?: boolean;
  yesLabel?: string;
  noLabel?: string;
  extraHtml?: string;
  isCheckboxRequired?: boolean;
  checkBoxLabel?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  modalForm: FormGroup;
  fieldLengthErrorMessage = '';
  imagePath = '';
  isChecked = false;
  constructor(
    protected readonly dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogObj,
    private readonly fb: FormBuilder
  ) {
    if (data.dialogMsg.includes('{value}') && data.dialogNote) {
      data.dialogMsg = data.dialogMsg.replace(
        '{value}',
        `<b>${data.dialogNote}</b>`
      );
      data.dialogNote = '';
    }
    if (data?.footerNote?.includes('{cycleDate}') && data.cycleDate) {
      data.footerNote = data.footerNote.replace(
        '{cycleDate}',
        `${data.cycleDate}`
      );
      data.cycleDate = '';
    }
    if (!data.confirmationIcon) {
      data.confirmationIcon = ConfirmationAction.CHECK;
    }
    this.imagePath = `assets/images/clm-images/requests/${data.confirmationIcon}.svg`;
    if (!this.data?.showInputField) {
      this.data.showInputField = false;
    }
    if (this.data.showInputField) {
      const validators =
        data.inputType === 'number'
          ? [Validators.required, Validators.max(data.max!)]
          : [
              Validators.required,
              Validators.maxLength(this.data.fieldLength!),
              noWhitespace,
              specialCharacterValidatorAllowingANDandPercentage,
            ];
      this.modalForm = this.fb.group({
        value: [this.data.defaultValue, validators],
      });
      this.fieldLengthErrorMessage = `Maximum characters allowed: ${
        this.data.fieldLength ? data.fieldLength : ''
      }`;
    }
  }
  ngOnInit(): void {
    const msgElement = document.getElementById('dialog-msg');
    msgElement!.innerHTML = this.data.dialogMsg;
  }

  onYes() {
    if (this.data.showInputField) {
      if (this.modalForm.valid) {
        this.dialogRef.close(this.modalForm.getRawValue());
      }
    } else if (this.data.isCheckboxRequired) {
      this.dialogRef.close({ isChecked: this.isChecked });
    } else {
      this.dialogRef.close(true);
    }
  }

  onNo() {
    this.dialogRef.close(false);
  }
}

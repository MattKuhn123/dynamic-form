import { Component, Inject } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { uniqueValidator } from "../shared/unique-value.validator";

export interface EditSectionKeyData {
  secIdx: string;
  secKey: string;
  invalid: string[];
};

@Component({
  selector: 'app-edit-section-key-dialog',
  template: `
    <h2 mat-dialog-title>Rename {{ data.secKey }}</h2>
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>Section Key</mat-label>
        <input matInput [formControl]="fc">
        <mat-error *ngIf="error">{{ getErrorMessage() }}</mat-error>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onClickCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onClickOk()" cdkFocusInitial>Ok</button>
    </div>
  `
})
export class EditSectionKeyDialog {
  protected error: boolean = false;
  protected fc: FormControl = new FormControl(this.data.secKey, [Validators.required, uniqueValidator(this.data.invalid)]);

  constructor(public dialogRef: MatDialogRef<EditSectionKeyDialog>, @Inject(MAT_DIALOG_DATA) protected data: EditSectionKeyData) {}
  
  protected onClickCancel(): void { this.dialogRef.close(); }
  protected onClickOk(): void {
    const exists: boolean = this.data.invalid.findIndex(section => section === this.fc.getRawValue()) > -1;
    if (exists) {
      this.error = true;
    } else {
      this.dialogRef.close(this.fc.value);
    }
  }

  protected getErrorMessage(): string {
    if (this.fc.hasError('required')) {
      return 'You must enter a value';
    }

    return this.fc.hasError('unique') ? 'Key must be unique!' : '';
  }
}
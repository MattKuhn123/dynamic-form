import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DeleteConfirmData {
  key: string;
};

@Component({
  selector: 'app-delete-confirm',
  styles: [],
  template: `
  <h2 mat-dialog-title>Delete {{ data.key }}'</h2>
  <div mat-dialog-content>
    Are you sure you want to delete '{{ data.key }}'?
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onClickCancel()">Cancel</button>
    <button mat-button color="primary" (click)="onClickOk()" cdkFocusInitial>Ok</button>
  </div>
  `
})
export class DeleteConfirmDialog {

  constructor(protected dialogRef: MatDialogRef<DeleteConfirmData>, @Inject(MAT_DIALOG_DATA) protected data: DeleteConfirmData) {}
  
  protected onClickCancel(): void { this.dialogRef.close(false); }
  protected onClickOk(): void { this.dialogRef.close(true); }
}

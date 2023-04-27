import { Component } from '@angular/core';

@Component({
  selector: 'app-presubmit-dialog',
  template: `
  <h1 mat-dialog-title>Are you sure?</h1>
  <div mat-dialog-content>
    <p>Are you sure your application is complete?</p>
  </div>
  <div mat-dialog-actions>
    <button mat-button [mat-dialog-close]="false">No</button>
    <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Submit</button>
  </div>
  `
})
export class PresubmitDialogComponent {

}

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <mat-toolbar color="primary">
    <mat-toolbar-row>
      <button mat-button [routerLink]="['']">Dynamic Form</button>
    </mat-toolbar-row>
  </mat-toolbar>

  <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  
}

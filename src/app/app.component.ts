import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <mat-toolbar color="primary">
    <mat-toolbar-row>
      <span>Dynamic form renderer</span>
    </mat-toolbar-row>
    <mat-toolbar-row>
      <button mat-button [routerLink]="['/edit']">Edit</button>
      <button mat-button [routerLink]="['/test']">Test</button>
    </mat-toolbar-row>
  </mat-toolbar>

  <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  
}

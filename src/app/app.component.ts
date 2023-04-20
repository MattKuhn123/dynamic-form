import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <mat-card>
    <mat-card-header>
      <mat-card-title>Welcome</mat-card-title>
      <mat-card-subtitle>Dynamic-Forms-Renderer</mat-card-subtitle>
    </mat-card-header>
    <mat-card-content>
      <p>
        This is the landing page of this POC
      </p>
    </mat-card-content>
    <mat-card-actions>
      <button mat-button [routerLink]="['/view']">View</button>
    </mat-card-actions>
  </mat-card>

  <mat-divider [inset]="true"></mat-divider>

  <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  
}

import { Component, OnInit } from '@angular/core';
import { AuthService, users } from './auth.service.stub';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  styles: [],
  template: `
  <mat-card>
    <mat-card-header>
      <mat-card-title>Welcome!</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <div>
        <mat-form-field>
          <mat-label for="user">Signed in as</mat-label>
          <mat-select id="user" [formControl]="user">
            <mat-option *ngFor="let userOption of userOptions" [value]="userOption">{{ userOption }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div>
        <button *ngIf="auth.isAdmin" mat-button [routerLink]="['/edit/list']">Go</button>
        <button *ngIf="auth.isSignedIn && !auth.isAdmin" mat-button [routerLink]="['/edit/list']">Go</button>
        <p *ngIf="!auth.isSignedIn">Please sign in</p>
      </div>
    </mat-card-content>
  </mat-card>
  `
})
export class HomeComponent implements OnInit {
  userOptions: (undefined | string)[] = users;
  user: FormControl = new FormControl(this.auth.user);

  constructor(protected auth: AuthService) { }

  ngOnInit(): void {
    this.user.valueChanges.subscribe(change => {
      this.auth.signIn(change);
    });
  }
}
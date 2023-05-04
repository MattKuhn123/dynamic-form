import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService, users } from './auth.service.stub';

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
        <p *ngIf="!auth.isSignedIn">Please sign in</p>
      </div>
    </mat-card-content>
    <mat-card-actions>
      <button *ngIf="auth.isAdmin" mat-button [routerLink]="['/edit/list']">Go</button>
      <button *ngIf="auth.isSignedIn && !auth.isAdmin" mat-button [routerLink]="['/entry/list']">Go</button>
    </mat-card-actions>
  </mat-card>
  `
})
export class HomeComponent implements OnInit {
  userOptions: (undefined | string)[] = users;
  user: FormControl = new FormControl(this.auth.user);

  constructor(protected auth: AuthService) { }

  ngOnInit(): void { this.user.valueChanges.subscribe(change => this.auth.signIn(change)); }
}

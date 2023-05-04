import { NgModule, isDevMode } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component.stub';
import { GuardService } from './guard.service.stub'

const appRoute: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'edit',
    loadChildren: () => import('./dynamic-form-edit/dynamic-form-edit.module').then(m => m.DynamicFormEditModule),
    canActivate: [GuardService]
  },
  {
    path: 'run',
    loadChildren: () => import('./dynamic-form-entry/dynamic-form-entry.module').then(m => m.DynamicFormEntryModule),
    canActivate: [GuardService]
  },
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoute),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),

    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

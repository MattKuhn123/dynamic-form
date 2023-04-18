import { NgModule, isDevMode } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MatStepperModule } from '@angular/material/stepper';

import { AppComponent } from './app.component';
import { DynamicStepComponent } from './dynamic-form/dynamic-step.component';
import { DynamicStepQuestionComponent } from './dynamic-form/dynamic-step-question.component';
import { DynamicStepperComponent } from './dynamic-form/dynamic-stepper.component';

@NgModule({
  declarations: [
    AppComponent,
    DynamicStepComponent,
    DynamicStepQuestionComponent,
    DynamicStepperComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatStepperModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

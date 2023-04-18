import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StepperService } from '../app/dynamic-form/stepper.service';
import { AppComponent } from '../app/app.component';
import { DynamicStepQuestionComponent } from '../app/dynamic-form/dynamic-step-question.component';
import { DynamicStepperComponent } from 'src/app/dynamic-form/dynamic-stepper.component';
import { MatStepperModule } from '@angular/material/stepper';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [
          AppComponent,
          DynamicStepperComponent,
          DynamicStepQuestionComponent,
        ],
        imports: [
          BrowserModule,
          BrowserAnimationsModule,
          MatStepperModule,
          HttpClientModule,
          ReactiveFormsModule,
        ],
        providers: [ StepperService ]
      }).compileComponents();
  
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});

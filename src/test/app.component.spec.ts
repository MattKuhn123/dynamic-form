import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StepperService } from '../app/dynamic-form/stepper.service';
import { AppComponent } from '../app/app.component';
import { DynamicStepComponent } from '../app/dynamic-form/dynamic-step.component';
import { DynamicStepQuestionComponent } from '../app/dynamic-form/dynamic-step-question.component';
import { QuestionControlService } from '../app/dynamic-form/question-control.service';
import { DynamicStepperComponent } from 'src/app/dynamic-form/dynamic-stepper.component';
import { MatStepperModule } from '@angular/material/stepper';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [
          AppComponent,
          DynamicStepComponent,
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
        providers: [ StepperService, QuestionControlService ]
      }).compileComponents();
  
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});

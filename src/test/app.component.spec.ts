import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DynamicFormService } from '../app/dynamic-form/dynamic-form.service';
import { AppComponent } from '../app/app.component';
import { DynamicStepQuestionComponent } from '../app/dynamic-form/dynamic-step-question.component';
import { DynamicStepComponent } from 'src/app/dynamic-form/dynamic-step.component';
import { MatStepperModule } from '@angular/material/stepper';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [
          AppComponent,
          DynamicStepComponent,
          DynamicStepQuestionComponent,
        ],
        imports: [
          BrowserModule,
          BrowserAnimationsModule,
          MatStepperModule,
          HttpClientModule,
          ReactiveFormsModule,
        ],
        providers: [ DynamicFormService ]
      }).compileComponents();
  
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});

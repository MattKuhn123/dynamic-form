import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from '../app/app.component';
import { DynamicFormComponent } from '../app/dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from '../app/dynamic-form/dynamic-form-question.component';
import { QuestionService } from 'src/app/dynamic-form/question.service';

describe('DynamicFormComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [
            AppComponent,
            DynamicFormComponent,
            DynamicFormQuestionComponent,
          ],
          imports: [
            BrowserModule,
            BrowserAnimationsModule,
            HttpClientModule,
            ReactiveFormsModule,
          ],
          providers: [ QuestionService ]
      }).compileComponents();
  
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
});

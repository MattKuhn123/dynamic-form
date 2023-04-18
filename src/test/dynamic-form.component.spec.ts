import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from '../app/app.component';
import { DynamicStepComponent } from '../app/dynamic-form/dynamic-step.component';
import { DynamicStepQuestionComponent } from '../app/dynamic-form/dynamic-step-question.component';
import { StepperService } from 'src/app/dynamic-form/stepper.service';
import { DynamicStepQuestion } from 'src/app/dynamic-form/dynamic-step-question.model';
import { firstValueFrom } from 'rxjs';

describe('DynamicFormComponent', () => {
    let component: DynamicStepComponent;
    let fixture: ComponentFixture<DynamicStepComponent>;

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
            HttpClientModule,
            ReactiveFormsModule,
          ],
          providers: [ StepperService ]
      }).compileComponents();
  
      fixture = TestBed.createComponent(DynamicStepComponent);
      component = fixture.componentInstance;

      const ss = TestBed.inject(StepperService);
      const questions = await firstValueFrom(ss.getSteps()) as DynamicStepQuestion<any>[];
      component.questions = questions;
      fixture.detectChanges();
    });

    it('should render the three questions and the submit button with 4 form-rows', () => {
      const formRows = fixture.debugElement.queryAll(By.css('.form-row'));
      expect(formRows.length).toBe(5);
    });

    it('should render the first question as first name as a text box', () => {
      const question = fixture.debugElement.queryAll(By.css('.form-row'))[0];
      expect(question.nativeElement.innerText).toBe("First name");
      const inputType = question.query(By.css('input'));
      expect(inputType.nativeElement.type).toBe("text");
    });

    it('should render the second question as email as an email', () => {
      const question = fixture.debugElement.queryAll(By.css('.form-row'))[1];
      expect(question.nativeElement.innerText).toBe("Email");
      const inputType = question.query(By.css('input'));
      expect(inputType.nativeElement.type).toBe("email");
    });

    it('should render the third question as Bravery Rating as a select', () => {
      const question = fixture.debugElement.queryAll(By.css('.form-row'))[2];
      expect(question.nativeElement.innerText).toContain("Bravery Rating");
      const inputType = question.query(By.css('select'));
      expect(inputType).toBeTruthy();
      
      const opts = question.query(By.css('select')).queryAll(By.css("option"));
      expect(opts[0].nativeElement.innerText.trim()).toBe("Solid");
      expect(opts[1].nativeElement.innerText.trim()).toBe("Great");
      expect(opts[2].nativeElement.innerText.trim()).toBe("Good");
      expect(opts[3].nativeElement.innerText.trim()).toBe("Unproven");
    });

    it('should render the third question as Bravery Rating as a select', () => {
      const question = fixture.debugElement.queryAll(By.css('.form-row'))[2];
      expect(question.nativeElement.innerText).toContain("Bravery Rating");
      const inputType = question.query(By.css('select'));
      expect(inputType).toBeTruthy();
      
      const opts = question.query(By.css('select')).queryAll(By.css("option"));
      expect(opts[0].nativeElement.innerText.trim()).toBe("Solid");
      expect(opts[1].nativeElement.innerText.trim()).toBe("Great");
      expect(opts[2].nativeElement.innerText.trim()).toBe("Good");
      expect(opts[3].nativeElement.innerText.trim()).toBe("Unproven");
    });

    it('should render the 4th question when the dependsOn clause is satisfied', () => {
      const question4BeforeDependsOnClause = fixture.debugElement.queryAll(By.css('.form-row'))[3].nativeElement.innerText;
      expect(question4BeforeDependsOnClause).toBeFalsy();

      component.form.controls["brave"].setValue("solid");
      fixture.detectChanges();

      const question4 = fixture.debugElement.queryAll(By.css('.form-row'))[3].nativeElement.innerText;
      expect(question4).toBe("Last name");
    });
});

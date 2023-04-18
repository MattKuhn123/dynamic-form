import { Component } from '@angular/core';

import { StepperService } from './stepper.service';
import { DynamicStep } from './dynamic-step.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicStepQuestion } from './dynamic-step-question.model';

@Component({
  selector: 'app-dynamic-stepper',
  template: `<div *ngIf="steps">
    <form (ngSubmit)="onSubmit()" [formGroup]="formGroup">
      <mat-stepper formArrayName="formArray">
        <p>ok</p>
        <div *ngFor="let step of steps; let i = index">
          <mat-step *ngIf="!hidden(step)" formGroupName="{{ i }}" [stepControl]="getFormGroupInArray(i)">
            <div *ngFor="let question of step.questions" class="form-row">
              <app-question [question]="question" [form]="getFormGroupInArray(i)"></app-question>
            </div>
          </mat-step>
        </div>
      </mat-stepper>
  </form>
  </div>`,
  providers: [ StepperService ]
})
export class DynamicStepperComponent {
  formArray!: FormArray;
  formGroup!: FormGroup;
  steps!: DynamicStep[];

  constructor(private qs: StepperService, private fb: FormBuilder) { }
  
  ngOnInit(): void {
    this.qs.getSteps().subscribe(steps => {
      this.steps = steps;
      this.formGroup = this.fb.group({
        formArray: this.fb.array(steps.map(step => this.toFormGroup(step.questions)))
      });
      
      this.formArray = this.formGroup.get('formArray') as FormArray;
    });
  }

  protected getFormGroupInArray(index: number): FormGroup {
    return this.formArray.at(index) as FormGroup;
  }

  protected hidden(step: DynamicStep): boolean {
    if (step.dependsOn.length === 0) {
      return false;
    }

    return step.dependsOn.findIndex(depends => this.getFormGroupInArray(depends.step).controls[depends.key].value === depends.value) <= -1;
  }

  protected onSubmit(): void {

  }

  private toFormGroup(questions: DynamicStepQuestion<any>[]): FormGroup {
    const group: any = {};
    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required) : new FormControl(question.value || '');
    });
    
    return new FormGroup(group);
  }
}

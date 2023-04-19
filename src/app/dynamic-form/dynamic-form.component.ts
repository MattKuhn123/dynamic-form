import { Component, OnInit } from '@angular/core';

import { DynamicFormService } from './dynamic-form.service';
import { DynamicFormSection } from './dynamic-form-section.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicFormQuestion } from './dynamic-form-question.model';
import { DynamicForm } from './dynamic-form.model';

@Component({
  selector: 'app-dynamic-form',
  template: `
  <div *ngIf="form">
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ form.title }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p> {{ form.description }} </p>
      </mat-card-content>
    </mat-card>

    <form (ngSubmit)="onSubmit()" [formGroup]="formGroup">
      <mat-stepper formArrayName="formArray">
        
        <div *ngFor="let section of sections; let i = index">
          <mat-step *ngIf="!hidden(section)" formGroupName="{{ i }}" [stepControl]="getFormGroupInArray(i)">
            <ng-template matStepLabel>{{section.title}}</ng-template>
            <div *ngFor="let question of section.questions" class="form-row">
              <app-dynamic-question [question]="question" [form]="getFormGroupInArray(i)"></app-dynamic-question>
            </div>
          </mat-step>
        </div>
      </mat-stepper>
    </form>
  </div>
  `,
  providers: [ DynamicFormService ]
})
export class DynamicFormComponent implements OnInit {
  formArray!: FormArray;
  formGroup!: FormGroup;
  form!: DynamicForm;

  get sections(): DynamicFormSection[] { return this.form.sections }

  constructor(private dynamicFormService: DynamicFormService, private formBuilder: FormBuilder) { }
  
  ngOnInit(): void {
    this.dynamicFormService.getForms().subscribe(forms => {
      this.form = forms[0];
      this.formGroup = this.formBuilder.group({
        formArray: this.formBuilder.array(this.sections.map(section => this.toFormGroup(section.questions)))
      });
      
      this.formArray = this.formGroup.get('formArray') as FormArray;
    });
  }

  protected getFormGroupInArray(index: number): FormGroup {
    return this.formArray.at(index) as FormGroup;
  }

  protected hidden(section: DynamicFormSection): boolean {
    if (section.dependsOn.length === 0) {
      return false;
    }

    return section.dependsOn.findIndex(depends => this.getFormGroupInArray(depends.step).controls[depends.key].value === depends.value) <= -1;
  }

  protected onSubmit(): boolean {
    // TODO
    return true;
  }

  private toFormGroup(questions: DynamicFormQuestion<any>[]): FormGroup {
    const group: any = {};
    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required) : new FormControl(question.value || '');
    });
    
    return new FormGroup(group);
  }
}

import { Component, OnInit } from '@angular/core';

import { DynamicFormService } from './dynamic-form.service';
import { DynamicFormSection } from './dynamic-form-section.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicFormQuestion } from './dynamic-form-question.model';
import { DynamicForm } from './dynamic-form.model';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Observable, map } from 'rxjs';

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

    <form (ngSubmit)="onPreSubmit()" [formGroup]="formGroup">
      <mat-stepper formArrayName="formArray" [linear]="true" [orientation]="(stepperOrientation | async)!">
        
        <div *ngFor="let section of sections; let i = index; let first = first; let last = last">
          <mat-step *ngIf="!hidden(section)" formGroupName="{{ i }}" [stepControl]="getFormGroupInArray(i)" [optional]="!section.required">
            <ng-template matStepLabel>{{section.title}}</ng-template>
            <h4>{{section.description}}</h4>
            <div *ngFor="let question of section.questions">
              <app-dynamic-question [question]="question" [form]="getFormGroupInArray(i)"></app-dynamic-question>
            </div>

            <div>
              <button *ngIf="!first" mat-button matStepperPrevious type="button">Back</button>
              <button *ngIf="!last" [disabled]="!getFormGroupInArray(i).valid" mat-button matStepperNext type="button">Next</button>
              <button *ngIf="last" [disabled]="!getFormGroupInArray(i).valid" mat-button type="submit">Submit</button>
            </div>
          </mat-step>
        </div>
      </mat-stepper>

      <!-- <button value="submit" type="submit">Submit</button> -->
    </form>
  </div>
  `,
  providers: [ DynamicFormService ]
})
export class DynamicFormComponent implements OnInit {
  formArray!: FormArray;
  formGroup!: FormGroup;
  form!: DynamicForm;
  stepperOrientation: Observable<StepperOrientation>;

  get sections(): DynamicFormSection[] { return this.form.sections }

  constructor(private dfSvc: DynamicFormService, private fb: FormBuilder, private dialog: MatDialog, private bo: BreakpointObserver) {
    this.stepperOrientation = this.bo
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }
  
  ngOnInit(): void {
    this.dfSvc.getForms().subscribe(form => {
      this.form = form;
      this.formGroup = this.fb.group({
        formArray: this.fb.array(this.sections.map(section => this.toFormGroup(section.questions)))
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

    return section.dependsOn.findIndex(dependsOn => this.getFormGroupInArray(dependsOn.section).controls[dependsOn.key].value === dependsOn.value) <= -1;
  }

  protected onPreSubmit(): void {
    const dialogRef = this.dialog.open(PreSubmitDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSubmit();
      }
    });
  }

  private onSubmit(): void {
    const value: any = { };
    this.formArray.getRawValue().forEach(formGroup => {
      Object.keys(formGroup).forEach(key => {
        value[key] = formGroup[key];
      })
    });
    
    console.log(JSON.stringify(value));
  }

  private toFormGroup(questions: DynamicFormQuestion<any>[]): FormGroup {
    const group: any = {};
    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required) : new FormControl(question.value || '');
    });
    
    return new FormGroup(group);
  }
}

@Component({
  selector: 'dialog-data-example-dialog',
  template: `
  <h1 mat-dialog-title>Are you sure?</h1>
  <div mat-dialog-content>
    <p>Are you sure your application is complete?</p>
  </div>
  <div mat-dialog-actions>
    <button mat-button [mat-dialog-close]="false">No</button>
    <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Submit</button>
  </div>
  `
})
export class PreSubmitDialog { }
import { Component, OnInit } from '@angular/core';

import { DynamicFormService } from '../shared/dynamic-form.service';
import { DynamicFormSection } from '../shared/dynamic-form-section.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { DynamicForm } from '../shared/dynamic-form.model';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Observable, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PresubmitDialogComponent } from './presubmit-dialog.component';

@Component({
  selector: 'app-dynamic-form',
  template: `
  <div *ngIf="form">
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ form.title }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p> {{ form.subtitle }} </p>
      </mat-card-content>
    </mat-card>

    <form (ngSubmit)="onPreSubmit()" [formGroup]="formGroup">
      <mat-stepper formArrayName="formArray" [linear]="true" [orientation]="(stepperOrientation | async)!">
        
        <div *ngFor="let section of form.sections; let sctnIdx = index; let first = first; let last = last">
          <mat-step *ngIf="!hidden(section)" formGroupName="{{ sctnIdx }}" [stepControl]="getFormGroupInArray(sctnIdx)" [optional]="!section.required">
            <ng-template matStepLabel>{{section.key}}</ng-template>

            <mat-card>
              <mat-card-header>
                <mat-card-title>
                  {{section.subtitle}}
                </mat-card-title>
              </mat-card-header>
              
              <mat-card-content>
                <div *ngFor="let control of getFormArray(sctnIdx).controls; let ctrlIdx = index; let lastControl = last">
                  <div *ngFor="let question of section.questions; let qstnIdx = index">
                    <app-dynamic-question [question]="question" [form]="getCtrlFormGroupInArray(ctrlIdx, sctnIdx)"></app-dynamic-question>
                  </div>
                  <mat-divider [inset]="true" *ngIf="!lastControl"></mat-divider>
                </div>
              </mat-card-content>

              <mat-card-actions align="start">
                <button type="button" mat-button *ngIf="section.list" (click)="onClickAdd(sctnIdx)">Add another</button>
                <button type="button" mat-button *ngIf="section.list"  [disabled]="getFormArray(sctnIdx).controls.length <= 1"(click)="onClickRemove(sctnIdx)">Remove Last</button>
                <button type="button" mat-button *ngIf="!first" matStepperPrevious>Back</button>
                <button type="button" mat-button color="primary" *ngIf="!last" [disabled]="!getFormGroupInArray(sctnIdx).valid && section.required" matStepperNext>Next</button>
                <button type="submit" mat-raised-button color="primary" *ngIf="last" [disabled]="!getFormGroupInArray(sctnIdx).valid">Submit</button>
              </mat-card-actions>
            </mat-card>
          </mat-step>
        </div>
      </mat-stepper>
    </form>
  </div>

  <mat-card>
    <mat-card-content>
      <mat-slide-toggle [formControl]="showJson">Show json</mat-slide-toggle>
      <pre *ngIf="formGroup && showJson.getRawValue()"> {{ stringified }} </pre>
    </mat-card-content>
  </mat-card>
  `,
})
export class DynamicFormComponent implements OnInit {
  formArray!: FormArray;
  formGroup!: FormGroup;
  form!: DynamicForm;
  stepperOrientation: Observable<StepperOrientation>;
  protected get stringified(): string { return JSON.stringify(this.formGroup.getRawValue(), null, 4) };

  protected showJson: FormControl = new FormControl(false);

  protected getFormArray(index: number): FormArray { return this.formArray.at(index) as FormArray; }
  protected getFormGroupInArray(index: number): FormGroup { return (this.formArray.at(index) as FormArray).at(0) as FormGroup; }
  protected getNamedFormGroupInArray(name: string): FormGroup { return (this.formArray.at((this.formArray.value as any[]).findIndex(sec => sec[0]._key === name)) as FormArray).at(0) as FormGroup; }
  protected getCtrlFormGroupInArray(ctrlIdx:number, sctnIdx: number): FormGroup { return (this.formArray.at(sctnIdx) as FormArray).at(ctrlIdx) as FormGroup; }
  protected getFormArrayInArray(index: number): FormArray { return this.formArray.at(index) as FormArray; }

  constructor(private dfSvc: DynamicFormService, private fb: FormBuilder, private dialog: MatDialog, private snackBar: MatSnackBar, private bo: BreakpointObserver) {
    this.stepperOrientation = this.bo
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }
  
  ngOnInit(): void {
    this.dfSvc.getForm().subscribe(form => {
      this.form = form;
      const formArrays: FormArray[] = this.form.sections.map(section => this.fb.array([this.sectionToFormGroup(section)]));
      const formArrayOfArrays: FormArray = this.fb.array(formArrays);
      this.formGroup = this.fb.group({
        formArray: formArrayOfArrays
      });

      this.formArray = this.formGroup.get('formArray') as FormArray;
    });
  }

  protected hidden(section: DynamicFormSection): boolean {
    if (section.conditions.length === 0) {
      return false;
    }

    return section.conditions.findIndex(conditions => this.getNamedFormGroupInArray(conditions.section).controls[conditions.key].value === conditions.value) <= -1;
  }

  protected onClickAdd(sctnIdx: number): void {
    const newGroup = this.sectionToFormGroup(this.form.sections[sctnIdx]);
    this.getFormArrayInArray(sctnIdx).push(newGroup);
  }

  protected onClickRemove(sctnIdx: number): void {
    this.getFormArrayInArray(sctnIdx).removeAt(this.getFormArrayInArray(sctnIdx).length - 1);
  }

  protected onPreSubmit(): void {
    const dialogRef = this.dialog.open(PresubmitDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSubmit();
      }
    });
  }

  private onSubmit(): void {
    this.snackBar.open("Submitted!", "OK");
  }

  private sectionToFormGroup(section: DynamicFormSection): FormGroup {
    const group: any = { _key: section.key };
    const questions = section.questions
    questions.forEach(question => {
      const validators: ValidatorFn[] = [];
      if (question.required) {
        validators.push(Validators.required);
      }

      if (question.controlType === "textbox" && question.type === "text") {
        if (question.email) {
          validators.push(Validators.email);
        } else {
          if (question.minLength) {
            validators.push(Validators.minLength(question.minLength));
          }
    
          if (question.maxLength) {
            validators.push(Validators.maxLength(question.maxLength));
          }
  
          validators.push(Validators.pattern(`[a-zA-Z${question.allowNumbers ? "0-9" : ""}${question.allowSpaces ? " " : ""}${question.allowPunctuation ? "_.,!\"'/$" : ""}]*`))
        }
      }

      if (question.controlType === "textbox" && question.type === "number") {
        if (question.min) {
          validators.push(Validators.min(question.min));
        }
  
        if (question.max) {
          validators.push(Validators.min(question.max));
        }
      }

      group[question.key] = new FormControl('', validators);
    });
    
    return this.fb.group(group);
  }
}
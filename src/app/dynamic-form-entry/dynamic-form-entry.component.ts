import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { PresubmitDialogComponent } from './presubmit-dialog.component';
import { DynamicFormEditStorageService } from '../shared/dynamic-form-edit-storage.service';
import { DynamicFormEntryStorageService } from './dynamic-form-entry-storage.service';
import { DynamicFormSection } from '../shared/dynamic-form-section.model';
import { DynamicForm } from '../shared/dynamic-form.model';

@Component({
  selector: 'app-dynamic-form',
  template: `
  <div *ngIf="form">
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ form.title }}</mat-card-title>
        <mat-card-subtitle>{{ form.subtitle }}</mat-card-subtitle>
      </mat-card-header>
    </mat-card>
    <form (ngSubmit)="onSubmit()" [formGroup]="formGroup">
      <mat-stepper formArrayName="sections" [linear]="true" [orientation]="(stepperOrientation | async)!">
        <div *ngFor="let section of form.sections; let secIdx = index; let first = first; let last = last">
          <mat-step *ngIf="!hidden(section)" formGroupName="{{ secIdx }}" [stepControl]="getSection(secIdx)" [optional]="!section.required">
            <ng-template matStepLabel>{{section.key}}</ng-template>
            <mat-card>
              <mat-card-header>
                <mat-card-title> {{section.key}} </mat-card-title>
                <mat-card-subtitle> {{section.subtitle}} </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div *ngIf="section.info" [innerHtml]="section.info"></div>
                <div *ngFor="let control of getSection(secIdx).controls; let secIdxIdx = index; let lastControl = last" style="display: flex; flex-wrap: wrap;" [style.flex-direction]="section.list ? 'row' : 'column'">
                  <div *ngFor="let question of section.questions;">
                    <app-dynamic-question 
                      [question]="question" 
                      [form]="getOccurrenceOfSection(secIdx, secIdxIdx)"
                    ></app-dynamic-question>
                  </div>
                  <mat-divider *ngIf="!lastControl"></mat-divider>
                  <button type="button" *ngIf="section.list && !(section.requireAtLeastOne && lastControl && secIdxIdx == 0)" mat-icon-button color="warn" (click)="onClickRemove(secIdx, secIdxIdx)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </mat-card-content>
              <mat-card-actions>
                <button type="button" mat-button *ngIf="!first" matStepperPrevious>Back</button>
                <button type="button" mat-button *ngIf="section.list" (click)="onClickAdd(secIdx)">Add another</button>
                <button type="button" mat-button color="primary" *ngIf="!last" [disabled]="!getSection(secIdx).valid && section.required" matStepperNext>Next</button>
                <button type="button" mat-button color="accent" (click)="onClickSave()">Save</button>
                <button type="submit" mat-raised-button color="primary" *ngIf="last" [disabled]="!getSection(secIdx).valid">Submit</button>
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
export class DynamicFormEntryComponent implements OnInit {
  get sections(): FormArray { return this.formGroup.get('sections') as FormArray; };
  formGroup!: FormGroup;
  form!: DynamicForm;
  stepperOrientation: Observable<StepperOrientation>;
  protected get stringified(): string { return JSON.stringify(this.formGroup.getRawValue(), null, 4) };

  protected showJson: FormControl = new FormControl(false);

  protected getSection(secIdx: number): FormArray { return this.sections.at(secIdx) as FormArray; }
  protected getOccurrencesOfSection(secIdx: number): FormArray { return this.sections.at(secIdx) as FormArray; }
  protected getOccurrenceOfSection(secIdx: number, secIdxIdx: number): FormGroup { return this.getOccurrencesOfSection(secIdx).at(secIdxIdx) as FormGroup; }
  private getFirstElementInSectionByKey(secKey: string): FormGroup { return (this.sections.at((this.sections.value as any[]).findIndex(sec => sec[0]._key === secKey)) as FormArray).at(0) as FormGroup; }

  constructor(private editStorage: DynamicFormEditStorageService,
    private entryStorage: DynamicFormEntryStorageService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private bo: BreakpointObserver,
    private route: ActivatedRoute) {
    this.stepperOrientation = this.bo
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }
  
  ngOnInit(): void { this.init();  }
  private async init(): Promise<void> { this.route.queryParams.subscribe(params => this.initForm(params['key'], params['entryKey'])); }
  
  private async initForm(editKey: string, entryKey: string): Promise<void> {
    this.form = await this.editStorage.getForm(editKey);
    const formEntry = await this.entryStorage.getForm(entryKey);
    const formArrays: FormArray[] = this.form.sections.map(section => this.fb.array([this.sectionToFormGroup(section)]));
    const formArrayOfArrays: FormArray = this.fb.array(formArrays);
    this.formGroup = this.fb.group({
      sections: formArrayOfArrays
    });
  }

  protected hidden(section: DynamicFormSection): boolean {
    if (section.conditions.length === 0) {
      return false;
    }

    return section.conditions.findIndex(conditions => this.getFirstElementInSectionByKey(conditions.section).controls[conditions.key].value === conditions.value) <= -1;
  }

  protected onClickAdd(secIdx: number): void { this.getOccurrencesOfSection(secIdx).push(this.sectionToFormGroup(this.form.sections[secIdx])); }
  protected onClickRemove(secIdx: number, secIdxIdx: number): void { this.getOccurrencesOfSection(secIdx).removeAt(secIdxIdx); }

  protected onClickSave(): void {
    this.snackBar.open("Saved!", "OK");
  }

  protected onSubmit(): void {
    const dialogRef = this.dialog.open(PresubmitDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open("Submitted!", "OK");
      }
    });
  }

  private sectionToFormGroup(section: DynamicFormSection): FormGroup {
    const group: any = { _key: section.key };
    section.questions.forEach(question => {
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
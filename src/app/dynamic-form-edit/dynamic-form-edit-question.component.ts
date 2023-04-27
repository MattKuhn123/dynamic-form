import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DynamicFormEditService } from '../shared/dynamic-form-edit.service';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormSection } from '../shared/dynamic-form-section.model';
import { EditQuestionKeyDialog } from './edit-question-key.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dynamic-form-edit-questions',
  styles: [],
  template: `<div [formGroup]="formGroup">
  <div formArrayName="questions">
    <div [formGroupName]="qi">
      <mat-card>
        <mat-card-content>
          <div>
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{i}}-{{qi}}-key">Key</mat-label>
              <input matInput formControlName="key" id="question-{{i}}-{{qi}}-key" type="text" />
              <mat-icon matSuffix color="primary" matTooltip="edit" (click)="onClickEditQuestionKey(qi)">edit</mat-icon>
            </mat-form-field>
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{i}}-{{qi}}-controlType">Control type</mat-label>
              <mat-select id="question-{{i}}-{{qi}}-controlType" formControlName="controlType">
                <mat-option value="textarea">textarea</mat-option>
                <mat-option value="textbox">textbox</mat-option>
                <mat-option value="dropdown">dropdown</mat-option>
                <mat-option value="radio">radio</mat-option>
                <mat-option value="date">date</mat-option>
                <mat-option value="file">file</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{i}}-{{qi}}-label">Label</mat-label>
              <input matInput formControlName="label" id="question-{{i}}-{{qi}}-label" type="text" />
            </mat-form-field>
            <mat-label attr.for="question-{{i}}-{{qi}}-required">
              <mat-checkbox formControlName="required" id="question-{{i}}-{{qi}}-required"></mat-checkbox>
              Question is required
            </mat-label>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card  *ngIf="dfeSvc.isQuestionOptionable(s, i, qi)">
        <mat-card-header>
          <mat-card-title>
            Options
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div formArrayName="options">
            <div *ngIf="dfeSvc.getQuestionOptions(s, i, qi).controls.length === 0">
              <div>
                <em>
                  This question has no options.
                </em>
              </div>
              <div>
                <button mat-button color="primary" (click)="onClickAddQuestionOption(qi, 0)">
                  Add option
                </button>
              </div>
            </div>
    
            <div *ngFor="let questionOptions of dfeSvc.getQuestionOptions(s, i, qi).controls; let qoi = index">
              <div [formGroupName]="qoi">
                <mat-form-field [appearance]="'outline'">
                  <mat-label attr.for="question-option-{{i}}-{{qi}}-key">Value</mat-label>
                  <input matInput formControlName="key" id="question-option-{{i}}-{{qoi}}-key" type="text" />
                </mat-form-field>
                <mat-form-field [appearance]="'outline'">
                  <mat-label attr.for="question-option-{{i}}-{{qi}}-value">Label</mat-label>
                  <input matInput formControlName="value" id="question-option-{{i}}-{{qoi}}-value" type="text" />
                </mat-form-field>
                <button mat-icon-button color="warn" (click)="onClickRemoveQuestionOption(qi, qoi)">
                  <mat-icon>delete</mat-icon>
                </button>
                <button mat-icon-button color="primary" (click)="onClickAddQuestionOption(qi, qoi)">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>
            Conditions
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="dfeSvc.getQuestionConditions(s, i, qi).controls.length === 0">
            <div>
              <em>There are no conditions under which this question will be displayed, so it will always be displayed by default.</em>
            </div>
            <div>
              <button mat-button color="primary" (click)="onClickAddQuestionCondition(qi, 0)">
                Add condition
              </button>
            </div>
          </div>
          <div formArrayName="conditions">
            <div *ngFor="let questionConditions of dfeSvc.getQuestionConditions(s, i, qi).controls; let qdoi = index" [formGroupName]="qdoi">
              <mat-form-field [appearance]="'outline'">
                <mat-label attr.for="question-conditions-{{i}}-{{qdoi}}-key">Question</mat-label>
                <mat-select id="question-conditions-{{i}}-{{qdoi}}-key" formControlName="key">
                  <mat-option *ngFor="let conditionalQuestion of dfeSvc.getQuestionsForConditions(s, dfeSvc.getSectionKey(s, i).getRawValue())" [value]="conditionalQuestion">
                    {{ conditionalQuestion }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
  
              <mat-form-field [appearance]="'outline'">
                <mat-label attr.for="question-conditions-{{i}}-{{qdoi}}-value">Value</mat-label>
                <mat-select id="question-conditions-{{i}}-{{qdoi}}-value" formControlName="value">
                  <mat-option *ngFor="let option of dfeSvc.getValuesForConditions(s, dfeSvc.getSectionKey(s, i).getRawValue(), dfeSvc.getQuestionConditionsQuestion(s, i, qi, qdoi).value)" [value]="option.key">
                    {{ option.value }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
  
              <button mat-icon-button color="warn" (click)="onClickRemoveQuestionCondition(qi, qdoi)">
                <mat-icon>delete</mat-icon>
              </button>
  
              <button mat-icon-button color="primary" (click)="onClickAddQuestionCondition(qi, qdoi)">
                <mat-icon>add</mat-icon>
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  </div>
  </div>`
})
export class DynamicFormEditQuestionComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;
  @Input() i!: number;
  @Input() qi!: number;

  get s(): FormArray { return this.fg.get("sections") as FormArray; }
  get formGroup(): FormGroup { return this.s.at(this.i) as FormGroup; }

  constructor(protected dfeSvc: DynamicFormEditService, private dialog: MatDialog) { }

  protected onClickAddQuestionCondition(qIdx: number, dpdsIdx: number): void { this.dfeSvc.getQuestionConditions(this.s, this.i, qIdx).insert(dpdsIdx, this.dfeSvc.questionConditionsToGroup(this.fb, {key: "", value: ""})); }
  protected onClickRemoveQuestionCondition(qIdx: number, dpdsIdx: number): void { this.dfeSvc.getQuestionConditions(this.s, this.i, qIdx).removeAt(dpdsIdx); }

  protected onClickAddQuestionOption(qIdx: number, qoIdx: number): void { this.dfeSvc.getQuestionOptions(this.s, this.i, qIdx).insert(qoIdx, this.dfeSvc.questionOptionToGroup(this.fb, {key: "", value: ""})); }
  protected onClickRemoveQuestionOption(qIdx: number, qoIdx: number): void { this.dfeSvc.getQuestionOptions(this.s, this.i, qIdx).removeAt(qoIdx); }

  protected onClickEditQuestionKey(qIdx: number): void {
    const dialogRef = this.dialog.open(EditQuestionKeyDialog, { data: {
      secIdx: this.i,
      secKey: this.dfeSvc.getSectionKey(this.s, this.i).getRawValue(),
      qKey: this.dfeSvc.getQuestionKey(this.s, this.i, qIdx).getRawValue(),
      qIdx: qIdx,
      invalid: (this.s.getRawValue() as DynamicFormSection[]).map(section => section.questions).flat().map(question => question.key)
    } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dfeSvc.getQuestionKey(this.s, this.i, qIdx).patchValue(result);
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) { moveItemInArray(this.dfeSvc.getQuestions(this.s, this.i).controls, event.previousIndex, event.currentIndex); }
}

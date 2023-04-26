import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DynamicFormEditService } from '../shared/dynamic-form-edit.service';
import { DynamicFormQuestion } from '../shared/dynamic-form-question.model';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormSection } from '../shared/dynamic-form-section.model';
import { EditQuestionKeyDialog } from './edit-question-key.component';

@Component({
  selector: 'app-dynamic-form-edit-questions',
  template: `<div [formGroup]="formGroup">
  <mat-accordion formArrayName="questions">
    <mat-expansion-panel *ngFor="let question of dfeSvc.getQuestions(s, i).controls; let qi = index" [formGroupName]="qi" #qtnPanel>
      <mat-expansion-panel-header>
        <mat-panel-title>
          Question {{ qi+1 }}: {{ dfeSvc.getQuestionLabel(s, i, qi).getRawValue() }}
        </mat-panel-title>
        <mat-panel-description>
          <button mat-icon-button [color]="qtnPanel.expanded ? 'primary' : 'none'" matTooltip="not required" *ngIf="!dfeSvc.getQuestionRequired(s, i, qi).getRawValue()">
            <mat-icon>flaky</mat-icon>
          </button>
          <button mat-icon-button [color]="qtnPanel.expanded ? 'primary' : 'none'" matTooltip="conditions" *ngIf="dfeSvc.getQuestionConditions(s, i, qi).length > 0">
            <mat-icon [matBadge]="dfeSvc.getQuestionConditions(s, i, qi).length" matBadgeColor="accent" matBadgeOverlap="false" matBadgeSize="small">rule</mat-icon>
          </button>
        </mat-panel-description>
      </mat-expansion-panel-header>
      <mat-action-row>
        <button mat-icon-button color="warn" matTooltip="delete" (click)="onClickRemoveQuestion(i, qi)">
          <mat-icon>delete</mat-icon>
        </button>
      </mat-action-row>

      <mat-stepper orientation="horizontal">
        <mat-step label="Question Properties">
          <div>
            <mat-form-field>
              <mat-label attr.for="question-{{i}}-{{qi}}-key">Key</mat-label>
              <input matInput formControlName="key" id="question-{{i}}-{{qi}}-key" type="text" />
              <mat-icon matSuffix color="primary" matTooltip="edit" (click)="onClickEditQuestionKey(i, qi)">edit</mat-icon>
            </mat-form-field>
          </div>
          <div>
            <mat-form-field>
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
          </div>
          <div>
            <mat-form-field>
              <mat-label attr.for="question-{{i}}-{{qi}}-label">Label</mat-label>
              <input matInput formControlName="label" id="question-{{i}}-{{qi}}-label" type="text" />
            </mat-form-field>
          </div>
          <div>
            <mat-label attr.for="question-{{i}}-{{qi}}-required">
              <mat-checkbox formControlName="required" id="question-{{i}}-{{qi}}-required"></mat-checkbox>
              Required
            </mat-label>
          </div>
        </mat-step>

        <mat-step label="Question Options" formArrayName="options" *ngIf="dfeSvc.isQuestionOptionable(s, i, qi)">
          <div *ngIf="dfeSvc.getQuestionOptions(s, i, qi).controls.length === 0">
            <em>This question has no options.</em>
          </div>

          <div *ngFor="let questionOptions of dfeSvc.getQuestionOptions(s, i, qi).controls; let qoi = index">
            <div [formGroupName]="qoi">
              <mat-form-field>
                <mat-label attr.for="question-option-{{i}}-{{qi}}-key">Value</mat-label>
                <input matInput formControlName="key" id="question-option-{{i}}-{{qoi}}-key" type="text" />
              </mat-form-field>
              <mat-form-field>
                <mat-label attr.for="question-option-{{i}}-{{qi}}-value">Label</mat-label>
                <input matInput formControlName="value" id="question-option-{{i}}-{{qoi}}-value" type="text" />
              </mat-form-field>
              <button mat-icon-button color="warn" (click)="onClickRemoveQuestionOption(i, qi, qoi)">
                <mat-icon>delete</mat-icon>
              </button>
              <button mat-icon-button color="primary" (click)="onClickAddQuestionOption(i, qi, qoi)">
                <mat-icon>add</mat-icon>
              </button>
            </div>
          </div>
        </mat-step>

        <mat-step [label]="dfeSvc.getQuestionConditions(s, i, qi).controls.length === 0 ? 'Question Conditions (None)' : 'Question Conditions'">
          <div *ngIf="dfeSvc.getQuestionConditions(s, i, qi).controls.length === 0">
            <div>
              <em>There are no conditions under which this question will be displayed, so it will always be displayed by default.</em>
            </div>
            <div>
              <button mat-button color="primary" (click)="onClickAddQuestionCondition(i, qi, 0)">
                Add condition
              </button>
            </div>
          </div>
          <div formArrayName="conditions">
            <div *ngFor="let questionConditions of dfeSvc.getQuestionConditions(s, i, qi).controls; let qdoi = index" [formGroupName]="qdoi">
              <mat-form-field>
                <mat-label attr.for="question-conditions-{{i}}-{{qdoi}}-key">Question</mat-label>
                <mat-select id="question-conditions-{{i}}-{{qdoi}}-key" formControlName="key">
                  <mat-option *ngFor="let conditionalQuestion of dfeSvc.getQuestionsForConditions(s, dfeSvc.getSectionKey(s, i).getRawValue())" [value]="conditionalQuestion">
                    {{ conditionalQuestion }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label attr.for="question-conditions-{{i}}-{{qdoi}}-value">Value</mat-label>
                <mat-select id="question-conditions-{{i}}-{{qdoi}}-value" formControlName="value">
                  <mat-option *ngFor="let option of dfeSvc.getValuesForConditions(s, dfeSvc.getSectionKey(s, i).getRawValue(), dfeSvc.getQuestionConditionsQuestion(s, i, qi, qdoi).value)" [value]="option.key">
                    {{ option.value }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <button mat-icon-button color="warn" (click)="onClickRemoveQuestionCondition(i, qi, qdoi)">
                <mat-icon>delete</mat-icon>
              </button>

              <button mat-icon-button color="primary" (click)="onClickAddQuestionCondition(i, qi, qdoi)">
                <mat-icon>add</mat-icon>
              </button>
            </div>
          </div>
        </mat-step>
      </mat-stepper>
    </mat-expansion-panel>
  </mat-accordion>
  <button type="button" (click)="onClickAddQuestion(i)" mat-stroked-button color="primary">Add</button>
  </div>`,
  styles: []
})
export class DynamicFormEditQuestionsComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;
  @Input() i!: number;
  get s(): FormArray { return this.fg.get("sections") as FormArray; }
  get formGroup(): FormGroup { return this.s.at(this.i) as FormGroup; }

  constructor(protected dfeSvc: DynamicFormEditService, private dialog: MatDialog) { }

  protected onClickAddQuestion(secIdx: number): void{ this.dfeSvc.getQuestions(this.s, secIdx).push(this.dfeSvc.questionToGroup(this.fb, new DynamicFormQuestion())); }
  protected onClickRemoveQuestion(secIdx: number, qIdx: number): void { this.dfeSvc.getQuestions(this.s, secIdx).removeAt(qIdx); }

  protected onClickAddQuestionCondition(secIdx: number, qIdx: number, dpdsIdx: number): void { this.dfeSvc.getQuestionConditions(this.s, secIdx, qIdx).insert(dpdsIdx, this.dfeSvc.questionConditionsToGroup(this.fb, {key: "", value: ""})); }
  protected onClickRemoveQuestionCondition(secIdx: number, qIdx: number, dpdsIdx: number): void { this.dfeSvc.getQuestionConditions(this.s, secIdx, qIdx).removeAt(dpdsIdx); }

  protected onClickAddQuestionOption(secIdx: number, qIdx: number, qoIdx: number): void { this.dfeSvc.getQuestionOptions(this.s, secIdx, qIdx).insert(qoIdx, this.dfeSvc.questionOptionToGroup(this.fb, {key: "", value: ""})); }
  protected onClickRemoveQuestionOption(secIdx: number, qIdx: number, qoIdx: number): void { this.dfeSvc.getQuestionOptions(this.s, secIdx, qIdx).removeAt(qoIdx); }

  protected onClickEditQuestionKey(secIdx: number, qIdx: number): void {
    const dialogRef = this.dialog.open(EditQuestionKeyDialog, { data: {
      secIdx: secIdx,
      secKey: this.dfeSvc.getSectionKey(this.s, secIdx).getRawValue(),
      qKey: this.dfeSvc.getQuestionKey(this.s, secIdx, qIdx).getRawValue(),
      qIdx: qIdx,
      invalid: (this.s.getRawValue() as DynamicFormSection[]).map(section => section.questions).flat().map(question => question.key)
    } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dfeSvc.getQuestionKey(this.s, secIdx, qIdx).patchValue(result);
      }
    });
  }
}

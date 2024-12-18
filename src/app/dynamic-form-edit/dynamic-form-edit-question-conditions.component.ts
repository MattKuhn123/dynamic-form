import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DynamicFormEditService } from './dynamic-form-edit.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialog } from './delete-confirm.dialog';
import { DynamicFormQuestionCondition } from '../shared/dynamic-form-question-condition.model';

@Component({
  selector: 'app-dynamic-form-edit-question-conditions',
  styles: [],
  template: `
  <mat-card [formGroup]="qEdit">
    <mat-card-header>
      <mat-card-title>
        Conditions
      </mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <div *ngIf="dfeSvc.getQuestionConditions(s, secEditIdx, qEditIdx).controls.length === 0">
        <div>
          <em>There are no conditions under which this question will be displayed, so it will always be displayed by default.</em>
        </div>
      </div>
      <div formArrayName="conditions">
        <div *ngFor="let questionConditions of dfeSvc.getQuestionConditions(s, secEditIdx, qEditIdx).controls; let qCndIdx = index" [formGroupName]="qCndIdx">
          <mat-form-field>
            <mat-label attr.for="question-conditions-{{secEditIdx}}-{{qCndIdx}}-key">Question</mat-label>
            <mat-select id="question-conditions-{{secEditIdx}}-{{qCndIdx}}-key" formControlName="key">
              <mat-option *ngFor="let conditionalQuestion of dfeSvc.getQuestionsForConditions(s, dfeSvc.getSectionKey(s, secEditIdx).getRawValue())" [value]="conditionalQuestion">
                {{ conditionalQuestion }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field>
            <mat-label attr.for="question-conditions-{{secEditIdx}}-{{qCndIdx}}-value">Value</mat-label>
            <mat-select id="question-conditions-{{secEditIdx}}-{{qCndIdx}}-value" formControlName="value">
              <mat-option *ngFor="let option of dfeSvc.getValuesForConditions(s, dfeSvc.getSectionKey(s, secEditIdx).getRawValue(), dfeSvc.getQuestionConditionsQuestion(s, secEditIdx, qEditIdx, qCndIdx).value)" [value]="option.key">
                {{ option.value }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <button type="button" mat-icon-button color="warn" (click)="onClickRemoveQuestionCondition(qEditIdx, qCndIdx)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
    </mat-card-content>
    <mat-card-actions>
      <button type="button" mat-button color="primary" (click)="onClickAddQuestionCondition(qEditIdx)">
        Add condition
      </button>
    </mat-card-actions>
  </mat-card>
  `,
})
export class DynamicFormEditQuestionConditionsComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;
  @Input() secEditIdx!: number;
  @Input() qEditIdx!: number;

  protected get s(): FormArray { return this.fg.get("sections") as FormArray; }
  protected get qEdit(): FormGroup { return this.dfeSvc.getQuestion(this.s, this.secEditIdx, this.qEditIdx) as FormGroup; }

  constructor(protected dfeSvc: DynamicFormEditService, private dialog: MatDialog) { }

  protected onClickAddQuestionCondition(qIdx: number): void { this.dfeSvc.getQuestionConditions(this.s, this.secEditIdx, qIdx).push(this.dfeSvc.questionConditionsToGroup(this.fb, new DynamicFormQuestionCondition())); }
  protected onClickRemoveQuestionCondition(qIdx: number, cndIdx: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, { data: { 
      key: `Condition on ${this.dfeSvc.getQuestionConditionsQuestion(this.s, this.secEditIdx, this.qEditIdx, cndIdx).getRawValue()}`
    } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dfeSvc.getQuestionConditions(this.s, this.secEditIdx, qIdx).removeAt(cndIdx);
      }
    });
  }
}

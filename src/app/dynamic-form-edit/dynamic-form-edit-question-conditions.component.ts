import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DynamicFormEditService } from './dynamic-form-edit.service';

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
        <div>
          <button mat-button color="primary" (click)="onClickAddQuestionCondition(qEditIdx, 0)">
            Add condition
          </button>
        </div>
      </div>
      <div formArrayName="conditions">
        <div *ngFor="let questionConditions of dfeSvc.getQuestionConditions(s, secEditIdx, qEditIdx).controls; let qdoi = index" [formGroupName]="qdoi">
          <mat-form-field>
            <mat-label attr.for="question-conditions-{{secEditIdx}}-{{qdoi}}-key">Question</mat-label>
            <mat-select id="question-conditions-{{secEditIdx}}-{{qdoi}}-key" formControlName="key">
              <mat-option *ngFor="let conditionalQuestion of dfeSvc.getQuestionsForConditions(s, dfeSvc.getSectionKey(s, secEditIdx).getRawValue())" [value]="conditionalQuestion">
                {{ conditionalQuestion }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field>
            <mat-label attr.for="question-conditions-{{secEditIdx}}-{{qdoi}}-value">Value</mat-label>
            <mat-select id="question-conditions-{{secEditIdx}}-{{qdoi}}-value" formControlName="value">
              <mat-option *ngFor="let option of dfeSvc.getValuesForConditions(s, dfeSvc.getSectionKey(s, secEditIdx).getRawValue(), dfeSvc.getQuestionConditionsQuestion(s, secEditIdx, qEditIdx, qdoi).value)" [value]="option.key">
                {{ option.value }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-icon-button color="warn" (click)="onClickRemoveQuestionCondition(qEditIdx, qdoi)">
            <mat-icon>delete</mat-icon>
          </button>

          <button mat-icon-button color="primary" (click)="onClickAddQuestionCondition(qEditIdx, qdoi)">
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </div>
    </mat-card-content>
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

  constructor(protected dfeSvc: DynamicFormEditService) { }

  protected onClickAddQuestionCondition(qIdx: number, dpdsIdx: number): void { this.dfeSvc.getQuestionConditions(this.s, this.secEditIdx, qIdx).insert(dpdsIdx, this.dfeSvc.questionConditionsToGroup(this.fb, {key: "", value: ""})); }
  protected onClickRemoveQuestionCondition(qIdx: number, dpdsIdx: number): void { this.dfeSvc.getQuestionConditions(this.s, this.secEditIdx, qIdx).removeAt(dpdsIdx); }
}

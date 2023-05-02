import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DynamicFormEditService } from '../shared/dynamic-form-edit.service';

@Component({
  selector: 'app-dynamic-form-edit-options',
  styles: [ ],
  template: `
  <mat-card [formGroup]="qEdit">
    <mat-card-header>
      <mat-card-title>
        Options
      </mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <div formArrayName="options">
        <div *ngIf="dfeSvc.getQuestionOptions(s, secEditIdx, qEditIdx).controls.length === 0">
          <div>
            <em>
              This question has no options.
            </em>
          </div>
          <div>
            <button type="button" mat-button color="primary" (click)="onClickAddQuestionOption(qEditIdx, 0)">
              Add option
            </button>
          </div>
        </div>
        <div *ngFor="let questionOptions of dfeSvc.getQuestionOptions(s, secEditIdx, qEditIdx).controls; let qoi = index">
          <div [formGroupName]="qoi">
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-option-{{secEditIdx}}-{{qEditIdx}}-key">Value</mat-label>
              <input matInput formControlName="key" id="question-option-{{secEditIdx}}-{{qoi}}-key" type="text" />
            </mat-form-field>
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-option-{{secEditIdx}}-{{qEditIdx}}-value">Label</mat-label>
              <input matInput formControlName="value" id="question-option-{{secEditIdx}}-{{qoi}}-value" type="text" />
            </mat-form-field>
            <button type="button" mat-icon-button color="warn" (click)="onClickRemoveQuestionOption(qEditIdx, qoi)">
              <mat-icon>delete</mat-icon>
            </button>
            <button type="button" mat-icon-button color="primary" (click)="onClickAddQuestionOption(qEditIdx, qoi)">
              <mat-icon>add</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </mat-card-content>
  </mat-card>
  `,
})
export class DynamicFormEditOptionsComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;
  @Input() secEditIdx!: number;
  @Input() qEditIdx!: number;

  get s(): FormArray { return this.fg.get("sections") as FormArray; }

  get qEdit(): FormGroup { return this.dfeSvc.getQuestion(this.s, this.secEditIdx, this.qEditIdx) as FormGroup; }

  constructor(protected dfeSvc: DynamicFormEditService) { }

  protected onClickAddQuestionOption(qIdx: number, qoIdx: number): void { this.dfeSvc.getQuestionOptions(this.s, this.secEditIdx, qIdx).insert(qoIdx, this.dfeSvc.questionOptionToGroup(this.fb, {key: "", value: ""})); }
  protected onClickRemoveQuestionOption(qIdx: number, qoIdx: number): void { this.dfeSvc.getQuestionOptions(this.s, this.secEditIdx, qIdx).removeAt(qoIdx); }
}

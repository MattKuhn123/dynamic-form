import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DynamicFormEditService } from '../shared/dynamic-form-edit.service';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormSection } from '../shared/dynamic-form-section.model';
import { EditQuestionKeyDialog } from './edit-question-key.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dynamic-form-edit-question',
  styles: [],
  template: `<div [formGroup]="formGroup">
  <div formArrayName="questions">
    <div [formGroupName]="qEditIdx">
      <mat-card>
        <mat-card-content>
          <div>
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qEditIdx}}-key">Key</mat-label>
              <input matInput formControlName="key" id="question-{{secEditIdx}}-{{qEditIdx}}-key" type="text" />
              <mat-icon matSuffix color="primary" matTooltip="edit" (click)="onClickEditQuestionKey(qEditIdx)">edit</mat-icon>
            </mat-form-field>
          </div>
          <div>
            <mat-label attr.for="question-{{secEditIdx}}-{{qEditIdx}}-required">
              <mat-checkbox formControlName="required" id="question-{{secEditIdx}}-{{qEditIdx}}-required"></mat-checkbox>
              Required
            </mat-label>
          </div>
          <div>
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qEditIdx}}-controlType">Control type</mat-label>
              <mat-select id="question-{{secEditIdx}}-{{qEditIdx}}-controlType" formControlName="controlType">
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
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qEditIdx}}-label">Label</mat-label>
              <input matInput formControlName="label" id="question-{{secEditIdx}}-{{qEditIdx}}-label" type="text" />
            </mat-form-field>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qEditIdx).getRawValue() === 'textbox'">
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qEditIdx}}-type">Type</mat-label>
              <mat-select id="question-{{secEditIdx}}-{{qEditIdx}}-type" formControlName="type">
                <mat-option value="text">text</mat-option>
                <mat-option value="number">number</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qEditIdx).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qEditIdx).getRawValue() === 'number'">
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qEditIdx}}-min">Minimum</mat-label>
              <input matInput formControlName="min" id="question-{{secEditIdx}}-{{qEditIdx}}-min" type="number" />
            </mat-form-field>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qEditIdx).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qEditIdx).getRawValue() === 'number'">
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qEditIdx}}-maxLength">Maximum</mat-label>
              <input matInput formControlName="max" id="question-{{secEditIdx}}-{{qEditIdx}}-max" type="number" />
            </mat-form-field>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qEditIdx).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qEditIdx).getRawValue() === 'text'">
            <mat-label attr.for="question-{{secEditIdx}}-{{qEditIdx}}-email">
              <mat-checkbox formControlName="email" id="question-{{secEditIdx}}-{{qEditIdx}}-required"></mat-checkbox>
              Email address
            </mat-label>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qEditIdx).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qEditIdx).getRawValue() === 'text'
            && !dfeSvc.getQuestionEmail(s, secEditIdx, qEditIdx).getRawValue()">
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qEditIdx}}-minLength">Minimum Length</mat-label>
              <input matInput formControlName="minLength" id="question-{{secEditIdx}}-{{qEditIdx}}-minLength" type="number" />
            </mat-form-field>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qEditIdx).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qEditIdx).getRawValue() === 'text'
            && !dfeSvc.getQuestionEmail(s, secEditIdx, qEditIdx).getRawValue()">
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qEditIdx}}-maxLength">Maximum Length</mat-label>
              <input matInput formControlName="maxLength" id="question-{{secEditIdx}}-{{qEditIdx}}-maxLength" type="number" />
            </mat-form-field>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qEditIdx).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qEditIdx).getRawValue() === 'text'
            && !dfeSvc.getQuestionEmail(s, secEditIdx, qEditIdx).getRawValue()">
            <mat-label attr.for="question-{{secEditIdx}}-{{qEditIdx}}-allowNumbers">
              <mat-checkbox formControlName="allowNumbers" id="question-{{secEditIdx}}-{{qEditIdx}}-allowNumbers"></mat-checkbox>
              Allow numbers
            </mat-label>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qEditIdx).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qEditIdx).getRawValue() === 'text'
            && !dfeSvc.getQuestionEmail(s, secEditIdx, qEditIdx).getRawValue()">
            <mat-label attr.for="question-{{secEditIdx}}-{{qEditIdx}}-allowSpaces">
              <mat-checkbox formControlName="allowSpaces" id="question-{{secEditIdx}}-{{qEditIdx}}-allowSpaces"></mat-checkbox>
              Allow spaces
            </mat-label>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qEditIdx).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qEditIdx).getRawValue() === 'text'
            && !dfeSvc.getQuestionEmail(s, secEditIdx, qEditIdx).getRawValue()">
            <mat-label attr.for="question-{{secEditIdx}}-{{qEditIdx}}-allowPunctuation">
              <mat-checkbox formControlName="allowPunctuation" id="question-{{secEditIdx}}-{{qEditIdx}}-allowPunctuation"></mat-checkbox>
              Allow punctuation
            </mat-label>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qEditIdx).getRawValue() === 'date'">
          <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qEditIdx}}-temporal">Type</mat-label>
              <mat-select id="question-{{secEditIdx}}-{{qEditIdx}}-temporal" formControlName="temporal">
                <mat-option value="past">Past</mat-option>
                <mat-option value="future">Future</mat-option>
                <mat-option value="">Either</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <app-dynamic-form-edit-options *ngIf="dfeSvc.isQuestionOptionable(s, secEditIdx, qEditIdx)"
        [fg]="fg"
        [fb]="fb"
        [secEditIdx]="secEditIdx"
        [qEditIdx]="qEditIdx"
      ></app-dynamic-form-edit-options>

      <app-dynamic-form-edit-question-conditions
        [fg]="fg"
        [fb]="fb"
        [secEditIdx]="secEditIdx"
        [qEditIdx]="qEditIdx"
      ></app-dynamic-form-edit-question-conditions>
    </div>
  </div>
  </div>`
})
export class DynamicFormEditQuestionComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;
  @Input() secEditIdx!: number;
  @Input() qEditIdx!: number;

  get s(): FormArray { return this.fg.get("sections") as FormArray; }
  get formGroup(): FormGroup { return this.s.at(this.secEditIdx) as FormGroup; }

  constructor(protected dfeSvc: DynamicFormEditService, private dialog: MatDialog) { }

  protected onClickEditQuestionKey(qIdx: number): void {
    const dialogRef = this.dialog.open(EditQuestionKeyDialog, { data: {
      secIdx: this.secEditIdx,
      secKey: this.dfeSvc.getSectionKey(this.s, this.secEditIdx).getRawValue(),
      qKey: this.dfeSvc.getQuestionKey(this.s, this.secEditIdx, qIdx).getRawValue(),
      qIdx: qIdx,
      invalid: (this.s.getRawValue() as DynamicFormSection[]).map(section => section.questions).flat().map(question => question.key)
    } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dfeSvc.getQuestionKey(this.s, this.secEditIdx, qIdx).patchValue(result);
      }
    });
  }

  protected drop(event: CdkDragDrop<string[]>) { moveItemInArray(this.dfeSvc.getQuestions(this.s, this.secEditIdx).controls, event.previousIndex, event.currentIndex); }
}

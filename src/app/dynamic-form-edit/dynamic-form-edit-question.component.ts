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
    <div [formGroupName]="qi">
      <mat-card>
        <mat-card-content>
          <div>
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qi}}-key">Key</mat-label>
              <input matInput formControlName="key" id="question-{{secEditIdx}}-{{qi}}-key" type="text" />
              <mat-icon matSuffix color="primary" matTooltip="edit" (click)="onClickEditQuestionKey(qi)">edit</mat-icon>
            </mat-form-field>
          </div>
          <div>
            <mat-label attr.for="question-{{secEditIdx}}-{{qi}}-required">
              <mat-checkbox formControlName="required" id="question-{{secEditIdx}}-{{qi}}-required"></mat-checkbox>
              Required
            </mat-label>
          </div>
          <div>
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qi}}-controlType">Control type</mat-label>
              <mat-select id="question-{{secEditIdx}}-{{qi}}-controlType" formControlName="controlType">
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
              <mat-label attr.for="question-{{secEditIdx}}-{{qi}}-label">Label</mat-label>
              <input matInput formControlName="label" id="question-{{secEditIdx}}-{{qi}}-label" type="text" />
            </mat-form-field>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qi).getRawValue() === 'textbox'">
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qi}}-type">Type</mat-label>
              <mat-select id="question-{{secEditIdx}}-{{qi}}-type" formControlName="type">
                <mat-option value="text">text</mat-option>
                <mat-option value="number">number</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qi).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qi).getRawValue() === 'number'">
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qi}}-min">Minimum</mat-label>
              <input matInput formControlName="min" id="question-{{secEditIdx}}-{{qi}}-min" type="number" />
            </mat-form-field>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qi).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qi).getRawValue() === 'number'">
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qi}}-maxLength">Maximum</mat-label>
              <input matInput formControlName="max" id="question-{{secEditIdx}}-{{qi}}-max" type="number" />
            </mat-form-field>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qi).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qi).getRawValue() === 'text'">
            <mat-label attr.for="question-{{secEditIdx}}-{{qi}}-email">
              <mat-checkbox formControlName="email" id="question-{{secEditIdx}}-{{qi}}-required"></mat-checkbox>
              Email address
            </mat-label>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qi).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qi).getRawValue() === 'text'
            && !dfeSvc.getQuestionEmail(s, secEditIdx, qi).getRawValue()">
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qi}}-minLength">Minimum Length</mat-label>
              <input matInput formControlName="minLength" id="question-{{secEditIdx}}-{{qi}}-minLength" type="number" />
            </mat-form-field>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qi).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qi).getRawValue() === 'text'
            && !dfeSvc.getQuestionEmail(s, secEditIdx, qi).getRawValue()">
            <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qi}}-maxLength">Maximum Length</mat-label>
              <input matInput formControlName="maxLength" id="question-{{secEditIdx}}-{{qi}}-maxLength" type="number" />
            </mat-form-field>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qi).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qi).getRawValue() === 'text'
            && !dfeSvc.getQuestionEmail(s, secEditIdx, qi).getRawValue()">
            <mat-label attr.for="question-{{secEditIdx}}-{{qi}}-allowNumbers">
              <mat-checkbox formControlName="allowNumbers" id="question-{{secEditIdx}}-{{qi}}-allowNumbers"></mat-checkbox>
              Allow numbers
            </mat-label>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qi).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qi).getRawValue() === 'text'
            && !dfeSvc.getQuestionEmail(s, secEditIdx, qi).getRawValue()">
            <mat-label attr.for="question-{{secEditIdx}}-{{qi}}-allowSpaces">
              <mat-checkbox formControlName="allowSpaces" id="question-{{secEditIdx}}-{{qi}}-allowSpaces"></mat-checkbox>
              Allow spaces
            </mat-label>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qi).getRawValue() === 'textbox'
            && dfeSvc.getQuestionType(s, secEditIdx, qi).getRawValue() === 'text'
            && !dfeSvc.getQuestionEmail(s, secEditIdx, qi).getRawValue()">
            <mat-label attr.for="question-{{secEditIdx}}-{{qi}}-allowPunctuation">
              <mat-checkbox formControlName="allowPunctuation" id="question-{{secEditIdx}}-{{qi}}-allowPunctuation"></mat-checkbox>
              Allow punctuation
            </mat-label>
          </div>

          <div *ngIf="dfeSvc.getQuestionCtrlType(s, secEditIdx, qi).getRawValue() === 'date'">
          <mat-form-field [appearance]="'outline'">
              <mat-label attr.for="question-{{secEditIdx}}-{{qi}}-temporal">Type</mat-label>
              <mat-select id="question-{{secEditIdx}}-{{qi}}-temporal" formControlName="temporal">
                <mat-option value="past">Past</mat-option>
                <mat-option value="future">Future</mat-option>
                <mat-option value="">Either</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="dfeSvc.isQuestionOptionable(s, secEditIdx, qi)">
        <mat-card-header>
          <mat-card-title>
            Options
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div formArrayName="options">
            <div *ngIf="dfeSvc.getQuestionOptions(s, secEditIdx, qi).controls.length === 0">
              <div>
                <em>
                  This question has no options.
                </em>
              </div>
              <div>
                <button type="button" mat-button color="primary" (click)="onClickAddQuestionOption(qi, 0)">
                  Add option
                </button>
              </div>
            </div>
    
            <div *ngFor="let questionOptions of dfeSvc.getQuestionOptions(s, secEditIdx, qi).controls; let qoi = index">
              <div [formGroupName]="qoi">
                <mat-form-field [appearance]="'outline'">
                  <mat-label attr.for="question-option-{{secEditIdx}}-{{qi}}-key">Value</mat-label>
                  <input matInput formControlName="key" id="question-option-{{secEditIdx}}-{{qoi}}-key" type="text" />
                </mat-form-field>
                <mat-form-field [appearance]="'outline'">
                  <mat-label attr.for="question-option-{{secEditIdx}}-{{qi}}-value">Label</mat-label>
                  <input matInput formControlName="value" id="question-option-{{secEditIdx}}-{{qoi}}-value" type="text" />
                </mat-form-field>
                <button type="button" mat-icon-button color="warn" (click)="onClickRemoveQuestionOption(qi, qoi)">
                  <mat-icon>delete</mat-icon>
                </button>
                <button type="button" mat-icon-button color="primary" (click)="onClickAddQuestionOption(qi, qoi)">
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
          <div *ngIf="dfeSvc.getQuestionConditions(s, secEditIdx, qi).controls.length === 0">
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
            <div *ngFor="let questionConditions of dfeSvc.getQuestionConditions(s, secEditIdx, qi).controls; let qdoi = index" [formGroupName]="qdoi">
              <mat-form-field [appearance]="'outline'">
                <mat-label attr.for="question-conditions-{{secEditIdx}}-{{qdoi}}-key">Question</mat-label>
                <mat-select id="question-conditions-{{secEditIdx}}-{{qdoi}}-key" formControlName="key">
                  <mat-option *ngFor="let conditionalQuestion of dfeSvc.getQuestionsForConditions(s, dfeSvc.getSectionKey(s, secEditIdx).getRawValue())" [value]="conditionalQuestion">
                    {{ conditionalQuestion }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
  
              <mat-form-field [appearance]="'outline'">
                <mat-label attr.for="question-conditions-{{secEditIdx}}-{{qdoi}}-value">Value</mat-label>
                <mat-select id="question-conditions-{{secEditIdx}}-{{qdoi}}-value" formControlName="value">
                  <mat-option *ngFor="let option of dfeSvc.getValuesForConditions(s, dfeSvc.getSectionKey(s, secEditIdx).getRawValue(), dfeSvc.getQuestionConditionsQuestion(s, secEditIdx, qi, qdoi).value)" [value]="option.key">
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
  @Input() secEditIdx!: number;
  @Input() qi!: number;

  get s(): FormArray { return this.fg.get("sections") as FormArray; }
  get formGroup(): FormGroup { return this.s.at(this.secEditIdx) as FormGroup; }

  constructor(protected dfeSvc: DynamicFormEditService, private dialog: MatDialog) { }

  protected onClickAddQuestionCondition(qIdx: number, dpdsIdx: number): void { this.dfeSvc.getQuestionConditions(this.s, this.secEditIdx, qIdx).insert(dpdsIdx, this.dfeSvc.questionConditionsToGroup(this.fb, {key: "", value: ""})); }
  protected onClickRemoveQuestionCondition(qIdx: number, dpdsIdx: number): void { this.dfeSvc.getQuestionConditions(this.s, this.secEditIdx, qIdx).removeAt(dpdsIdx); }

  protected onClickAddQuestionOption(qIdx: number, qoIdx: number): void { this.dfeSvc.getQuestionOptions(this.s, this.secEditIdx, qIdx).insert(qoIdx, this.dfeSvc.questionOptionToGroup(this.fb, {key: "", value: ""})); }
  protected onClickRemoveQuestionOption(qIdx: number, qoIdx: number): void { this.dfeSvc.getQuestionOptions(this.s, this.secEditIdx, qIdx).removeAt(qoIdx); }

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

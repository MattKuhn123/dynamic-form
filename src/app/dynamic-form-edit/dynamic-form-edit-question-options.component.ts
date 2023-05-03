import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DynamicFormEditService } from './dynamic-form-edit.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialog } from './delete-confirm.dialog';
import { DynamicFormQuestionOption } from '../shared/dynamic-form-question-option.model';

@Component({
  selector: 'app-dynamic-form-edit-question-options',
  styles: [],
  template: `
  <mat-card [formGroup]="qEdit">
    <mat-card-header>
      <mat-card-title>
        Options
      </mat-card-title>
    </mat-card-header>
    <mat-card-content formArrayName="options">
      <div *ngIf="dfeSvc.getQuestionOptions(s, secEditIdx, qEditIdx).controls.length === 0">
        <div>
          <em>
            This question has no options.
          </em>
        </div>
      </div>
      <mat-list cdkDropList (cdkDropListDropped)="handleDropListDropped($event)">
        <mat-list-item role="listitem" *ngFor="let questionOptions of dfeSvc.getQuestionOptions(s, secEditIdx, qEditIdx).controls; let qoi = index" cdkDrag>
          <mat-icon matListItemIcon>drag_indicator</mat-icon>
          <div [formGroupName]="qoi">
            <mat-form-field>
              <mat-label attr.for="question-option-{{secEditIdx}}-{{qEditIdx}}-key">Value</mat-label>
              <input matInput formControlName="key" id="question-option-{{secEditIdx}}-{{qoi}}-key" type="text" />
            </mat-form-field>
            <mat-form-field>
              <mat-label attr.for="question-option-{{secEditIdx}}-{{qEditIdx}}-value">Label</mat-label>
              <input matInput formControlName="value" id="question-option-{{secEditIdx}}-{{qoi}}-value" type="text" />
            </mat-form-field>
            <button type="button" mat-icon-button color="warn" (click)="onClickRemoveQuestionOption(qEditIdx, qoi)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </mat-list-item>
      </mat-list>
    </mat-card-content>
    <mat-card-footer>
      <button type="button" mat-button color="primary" (click)="onClickAddQuestionOption(qEditIdx, 0)">
        Add option
      </button>
    </mat-card-footer>
  </mat-card>
  `,
})
export class DynamicFormEditQuestionOptionsComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;
  @Input() secEditIdx!: number;
  @Input() qEditIdx!: number;

  protected get s(): FormArray { return this.fg.get("sections") as FormArray; }
  protected get qEdit(): FormGroup { return this.dfeSvc.getQuestion(this.s, this.secEditIdx, this.qEditIdx) as FormGroup; }

  protected get qEditOptions(): FormArray { return this.qEdit.get("options") as FormArray; }

  constructor(protected dfeSvc: DynamicFormEditService, private dialog: MatDialog) { }

  protected onClickAddQuestionOption(qIdx: number, qoIdx: number): void { this.dfeSvc.getQuestionOptions(this.s, this.secEditIdx, qIdx).insert(qoIdx, this.dfeSvc.questionOptionToGroup(this.fb, new DynamicFormQuestionOption())); }
  protected onClickRemoveQuestionOption(qIdx: number, qoIdx: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, { data: { 
      key: `${this.dfeSvc.getQuestionOptionValue(this.s, this.secEditIdx, this.qEditIdx, qoIdx).getRawValue()}`
    } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dfeSvc.getQuestionOptions(this.s, this.secEditIdx, qIdx).removeAt(qoIdx);
      }
    });
  }

  protected handleDropListDropped(event: CdkDragDrop<string[]>) { moveItemInArray(this.qEditOptions.controls, event.previousIndex, event.currentIndex); }
}

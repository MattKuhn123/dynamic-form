import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { DynamicFormEditService } from '../shared/dynamic-form-edit.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DynamicFormQuestion } from '../shared/dynamic-form-question.model';

@Component({
  selector: 'app-dynamic-form-edit-questions',
  styles: [ ],
  template: `
  <div [formGroup]="secEdit">
    <mat-card formArrayName="questions">
      <mat-card-header>
        <mat-card-title>
          Questions
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div *ngIf="secEditQuestions.controls.length === 0">
          <div>
            <em>There are no questions for this section!</em>
          </div>
        </div>
        <mat-list cdkDropList (cdkDropListDropped)="reorderQuestions($event)">
          <mat-list-item role="listitem" *ngFor="let question of secEditQuestions.controls; let qEditIdx = index" [formGroupName]="qEditIdx" cdkDrag>
            <mat-icon matListItemIcon>drag_indicator</mat-icon>
            <span matListItemTitle>
              <button type="button" mat-button matTooltip="edit" color="primary" (click)="onClickEditQuestion(qEditIdx)"><mat-icon>edit</mat-icon></button>
              <button type="button" mat-button matTooltip="delete" color="warn" (click)="onClickRemoveQuestion(qEditIdx)"><mat-icon>delete</mat-icon></button>
              {{ dfeSvc.getQuestionKey(s, secEditIdx, qEditIdx).getRawValue() }}
              <button type="button" mat-button [matTooltip]="flatten(getQuestionErrors(qEditIdx))" color="warn" *ngIf="dfeSvc.getQuestion(s, secEditIdx, qEditIdx).invalid" ><mat-icon>error</mat-icon></button>
              <button type="button" mat-button matTooltip="required" *ngIf="dfeSvc.getQuestionRequired(s, secEditIdx, qEditIdx).getRawValue()">
                <mat-icon>emergency</mat-icon>
              </button>
              <button type="button" mat-button [matTooltip]="dfeSvc.getQuestionCtrlType(s, secEditIdx, qEditIdx).getRawValue()" [ngSwitch]="dfeSvc.getQuestionCtrlType(s, secEditIdx, qEditIdx).getRawValue()">
                <mat-icon *ngSwitchCase="'textarea'">notes</mat-icon>
                <mat-icon *ngSwitchCase="'textbox'">short_text</mat-icon>
                <mat-icon *ngSwitchCase="'dropdown'">list</mat-icon>
                <mat-icon *ngSwitchCase="'radio'">radio</mat-icon>
                <mat-icon *ngSwitchCase="'date'">edit_calendar</mat-icon>
                <mat-icon *ngSwitchCase="'file'">article</mat-icon>
              </button>
              <button type="button" mat-button matTooltip="conditions" *ngIf="dfeSvc.getQuestionConditions(s, secEditIdx, qEditIdx).length > 0">
                <mat-icon [matBadge]="dfeSvc.getQuestionConditions(s, secEditIdx, qEditIdx).length" matBadgeColor="primary" matBadgeOverlap="false" matBadgeSize="small">rule</mat-icon>
              </button>
            </span>
          </mat-list-item>
        </mat-list>
      </mat-card-content>
      <mat-card-actions>
        <button type="button" (click)="onClickAddQuestion()" mat-button color="primary">
          Add question
        </button>
      </mat-card-actions>
    </mat-card>
  </div>
  `,
})
export class DynamicFormEditQuestionsComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;
  get s(): FormArray { return this.fg.get("sections") as FormArray; }

  @Input() secEdit!: FormGroup;
  @Input() secEditIdx!: number;

  @Output() raiseClickEditQuestion: EventEmitter<number> = new EventEmitter<number>();

  protected qEditIdx!: number;

  protected get secEditQuestions(): FormArray { return this.secEdit.get("questions") as FormArray; }
  protected get secEditQuestion(): FormGroup { return (this.secEditQuestions).at(this.qEditIdx) as FormGroup; }
  protected get secEditQuestionKey(): FormControl { return this.secEditQuestion.get("key") as FormControl; }

  constructor(protected dfeSvc: DynamicFormEditService) { }

  protected flatten(strings: string[]): string { return [... new Set(strings)].join(", "); }

  protected onClickAddQuestion(): void{ this.secEditQuestions.push(this.dfeSvc.questionToGroup(this.fb, new DynamicFormQuestion())); }

  protected onClickEditQuestion(qEditIdx: number): void {
    debugger;
    this.qEditIdx = qEditIdx;
    this.raiseClickEditQuestion.emit(qEditIdx);
  }
  protected onClickRemoveQuestion(qIdx: number): void { this.secEditQuestions.removeAt(qIdx); }

  protected getQuestionErrors(qIdx: number): string[] {
    const errs: string[] = [];
    const qForm: FormGroup = this.dfeSvc.getQuestion(this.s, this.secEditIdx, qIdx);

    const formErrors: ValidationErrors | null | undefined = qForm?.errors;
    if (formErrors) {
      Object.keys(formErrors).forEach(keyError => {
        errs.push(keyError);
      });
    }

    Object.keys(qForm.controls).forEach(key => {
      const control = qForm.get(key);
      const controlErrors: ValidationErrors | null | undefined = control?.errors;
      if (controlErrors) {
        errs.push(key);
      }
    });

    return errs;
  }

  protected reorderQuestions(event: CdkDragDrop<string[]>) { moveItemInArray(this.secEditQuestions.controls, event.previousIndex, event.currentIndex); }
}

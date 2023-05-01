import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { DynamicFormSection } from '../shared/dynamic-form-section.model';
import { DynamicFormEditService } from '../shared/dynamic-form-edit.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dynamic-form-edit-sections',
  styles: [
    'mat-panel-description { display: flex; gap: 5px; flex-wrap: wrap; }',
    'footer { position: fixed; bottom: 10px; text-align: center; width: 100%; }',
  ],
  template: `<div [formGroup]="fg">
  <mat-tab-group [selectedIndex]="selectedTabIndex" (selectedIndexChange)="selectedTabIndex = $event">
    <mat-tab label="Form">
      <mat-card>
        <mat-card-content>
          <div>
            <mat-form-field>
              <mat-label for="title">Title</mat-label>
              <input matInput formControlName="title" id="title" type="text" />
            </mat-form-field>
          </div>
          <div>
            <mat-form-field>
              <mat-label for="description">Subtitle</mat-label>
              <textarea matInput formControlName="subtitle" id="subtitle" type="text"></textarea>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-content>
          <div *ngIf="s.controls.length === 0">
            <div>
              <em>There are no sections in this form!</em>
            </div>
          </div>
          <mat-list formArrayName="sections" cdkDropList (cdkDropListDropped)="handleDropListDropped($event)">
            <mat-list-item role="listitem" *ngFor="let section of s.controls; let i = index" [formGroupName]="i" cdkDrag>
              <mat-icon matListItemIcon>drag_indicator</mat-icon>
              <span matListItemTitle>
                <button type="button" mat-button matTooltip="edit" color="primary" (click)="onClickEditSection(i)"><mat-icon>edit</mat-icon></button>
                <button type="button" mat-button matTooltip="delete" color="warn" (click)="onClickRemoveSection(i)"><mat-icon>delete</mat-icon></button>
                  {{ dfeSvc.getSectionKey(s, i).getRawValue() }}
                <button type="button" mat-button [matTooltip]="flatten(getSectionErrors(i))" color="warn" *ngIf="dfeSvc.getSection(s, i).invalid" ><mat-icon>error</mat-icon></button>
                <button type="button" mat-button matTooltip="list" *ngIf="dfeSvc.getSectionList(s, i).getRawValue()">
                  <mat-icon>list_alt</mat-icon>
                </button>
                <button type="button" mat-button matTooltip="required" *ngIf="dfeSvc.getSectionRequired(s, i).getRawValue()">
                  <mat-icon>emergency</mat-icon>
                </button>
                <button type="button" mat-button matTooltip="questions">
                  <mat-icon [matBadge]="dfeSvc.getQuestions(s, i).length" matBadgeColor="primary" matBadgeOverlap="false" matBadgeSize="small">question_answer</mat-icon>
                </button>
                <button type="button" mat-button matTooltip="conditions" *ngIf="dfeSvc.getSectionConditions(s, i).length > 0">
                  <mat-icon [matBadge]="dfeSvc.getSectionConditions(s, i).length" matBadgeColor="primary" matBadgeOverlap="false" matBadgeSize="small">rule</mat-icon>
                </button>
              </span>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
        <mat-card-actions>
          <button type="button" (click)="onClickAddSection()" mat-button color="primary">
            Add section
          </button>
        </mat-card-actions>
      </mat-card>
    </mat-tab>
    <mat-tab label="Section" *ngIf="selectedTabIndex > 0">
      <app-dynamic-form-edit-section
        [fb]="fb"
        [fg]="fg"
        [secEditIdx]="secEditIdx"
        (raiseClickEditQuestion)="handleClickEditQuestion($event)"
      >
      </app-dynamic-form-edit-section>
    </mat-tab>
    <mat-tab label="Question" *ngIf="selectedTabIndex > 1">
      <app-dynamic-form-edit-question 
        [fb]="fb" 
        [fg]="fg" 
        [secEditIdx]="secEditIdx" 
        [qi]="qEditIdx"
      ></app-dynamic-form-edit-question>
    </mat-tab>
  </mat-tab-group>
  </div>`
})
export class DynamicFormEditSectionsComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;
  get s(): FormArray { return this.fg.get("sections") as FormArray; }

  protected secEditIdx: number = 0;
  protected qEditIdx: number = 0;
  protected selectedTabIndex: number = 0;

  constructor(protected dfeSvc: DynamicFormEditService) { }

  protected onClickAddSection(): void { this.s.push(this.dfeSvc.sectionToGroup(this.fb, new DynamicFormSection())); }
  protected onClickRemoveSection(secIdx: number): void { this.s.removeAt(secIdx); }
  protected onClickEditSection(secEditIdx: number): void {
    this.secEditIdx = secEditIdx;
    this.selectedTabIndex = 1;
  }

  protected flatten(strings: string[]): string { return [... new Set(strings)].join(", "); }

  protected getSectionErrors(secIdx: number): string[] {
    const secForm: FormGroup = this.dfeSvc.getSection(this.s, secIdx);
    const errs: string[] = [];

    const formErrors: ValidationErrors | null | undefined = secForm?.errors;
    if (formErrors) {
      Object.keys(formErrors).forEach(keyError => {
        errs.push(keyError);
      });
    }

    Object.keys(secForm.controls).forEach(key => {
      const control = secForm.get(key);
      const controlErrors: ValidationErrors | null | undefined = control?.errors;
      if (controlErrors) {
        errs.push(key);
      }
    });

    return errs;
  }

  protected handleDropListDropped(event: CdkDragDrop<string[]>) { moveItemInArray(this.s.controls, event.previousIndex, event.currentIndex); }

  protected handleClickEditQuestion(qEditIdx: number): void {
    this.qEditIdx = qEditIdx;
    this.selectedTabIndex = 2;
  }
}


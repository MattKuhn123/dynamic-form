import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormSection } from '../shared/dynamic-form-section.model';
import { EditSectionKeyDialog } from './edit-section-key.component';
import { DynamicFormEditService } from '../shared/dynamic-form-edit.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DynamicFormQuestion } from '../shared/dynamic-form-question.model';

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
              <mat-label for="description">Description</mat-label>
              <textarea matInput formControlName="description" id="description" type="text"></textarea>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-content>
          <mat-list formArrayName="sections" cdkDropList (cdkDropListDropped)="reorderSections($event)">
            <mat-list-item role="listitem" *ngFor="let section of s.controls; let i = index" [formGroupName]="i" #secListItem cdkDrag>
              <mat-icon matListItemIcon>drag_indicator</mat-icon>
              <span matListItemTitle>
                Section {{ i+1 }}: {{ dfeSvc.getSectionKey(s, i).getRawValue() }}
                <button type="button" mat-button [matTooltip]="flatten(getSectionErrors(i))" color="warn" *ngIf="dfeSvc.getSection(s, i).invalid" ><mat-icon>error</mat-icon></button>
                <button type="button" mat-button matTooltip="edit" color="primary" (click)="onClickEditSection(i)"><mat-icon>edit</mat-icon></button>
                <button type="button" mat-button matTooltip="delete" color="warn" (click)="onClickRemoveSection(i)"><mat-icon>delete</mat-icon></button>
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
    
    <mat-tab [formGroup]="secEdit" [label]="'Section: ' + secEditKey.getRawValue()" *ngIf="selectedTabIndex > 0">
      <mat-card>
        <mat-card-content>
          <div>
            <mat-form-field [appearance]="'outline'">
              <mat-label for="section-key">Key</mat-label>
              <input matInput formControlName="key" id="section-key" type="text"/>
              <mat-icon matSuffix color="primary" matTooltip="edit" (click)="onClickEditSectionKey()">edit</mat-icon>
            </mat-form-field>
          </div>
          <div>
            <mat-label for="section-required">
              <mat-checkbox formControlName="required" id="section-required"></mat-checkbox>
              Required
            </mat-label>
          </div>
          <div>
            <mat-label for="section-list">
              <mat-checkbox formControlName="list" id="section-list"></mat-checkbox>
              List
            </mat-label>
          </div>
          <div>
            <mat-form-field [appearance]="'outline'">
              <mat-label for="section-description">Description</mat-label>
              <textarea matInput formControlName="description" id="section-description" type="text"></textarea>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

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
            <div>
              <button type="button" (click)="onClickAddQuestion()" mat-button color="primary">
                Add question
              </button>
            </div>
          </div>

          <mat-list cdkDropList (cdkDropListDropped)="reorderQuestions($event)">
            <mat-list-item role="listitem" *ngFor="let question of secEditQuestions.controls; let qi = index" [formGroupName]="qi" #qListItem cdkDrag>
              <mat-icon matListItemIcon>drag_indicator</mat-icon>
              <span matListItemTitle>
                Question {{ qi+1 }}: {{ dfeSvc.getQuestionKey(s, secEditIdx, qi).getRawValue() }}
                <button type="button" mat-button [matTooltip]="flatten(getQuestionErrors(qi))" color="warn" *ngIf="dfeSvc.getQuestion(s, secEditIdx, qi).invalid" ><mat-icon>error</mat-icon></button>
                <button type="button" mat-button matTooltip="edit" color="primary" (click)="onClickEditQuestion(qi)"><mat-icon>edit</mat-icon></button>
                <button type="button" mat-button matTooltip="delete" color="warn" (click)="onClickRemoveQuestion(qi)"><mat-icon>delete</mat-icon></button>
                <button type="button" mat-button matTooltip="required" *ngIf="dfeSvc.getQuestionRequired(s, secEditIdx, qi).getRawValue()">
                  <mat-icon>emergency</mat-icon>
                </button>
                <button type="button" mat-button [matTooltip]="dfeSvc.getQuestionCtrlType(s, secEditIdx, qi).getRawValue()" [ngSwitch]="dfeSvc.getQuestionCtrlType(s, secEditIdx, qi).getRawValue()">
                  <mat-icon *ngSwitchCase="'textarea'">notes</mat-icon>
                  <mat-icon *ngSwitchCase="'textbox'">short_text</mat-icon>
                  <mat-icon *ngSwitchCase="'dropdown'">list</mat-icon>
                  <mat-icon *ngSwitchCase="'radio'">radio</mat-icon>
                  <mat-icon *ngSwitchCase="'date'">edit_calendar</mat-icon>
                  <mat-icon *ngSwitchCase="'file'">article</mat-icon>
                </button>
                <button type="button" mat-button matTooltip="conditions" *ngIf="dfeSvc.getQuestionConditions(s, secEditIdx, qi).length > 0">
                  <mat-icon [matBadge]="dfeSvc.getQuestionConditions(s, secEditIdx, qi).length" matBadgeColor="primary" matBadgeOverlap="false" matBadgeSize="small">rule</mat-icon>
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
      
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            Conditions
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="secEditConditions.controls.length === 0">
            <div>
              <em>There are no conditions under which this section will be displayed, so it will always be displayed by default.</em>
            </div>
            <div>
              <button type="button" mat-button color="primary" (click)="onClickAddSectionCondition(0)">
                Add condition
              </button>
            </div>
          </div>
    
          <div *ngFor="let conditions of secEditConditions.controls; let doi = index" formArrayName="conditions">
            <div [formGroupName]="doi">
              <mat-form-field [appearance]="'outline'">
                <mat-label attr.for="conditions-{{doi}}-section">Section</mat-label>
                <mat-select id="conditions-{{doi}}-section" formControlName="section">
                  <mat-option *ngFor="let key of dfeSvc.getSectionsForSectionConditions(s)" [value]="key">{{ key }}</mat-option>
                </mat-select>
              </mat-form-field>
    
              <mat-form-field [appearance]="'outline'">
                <mat-label attr.for="conditions-{{doi}}-key">Question</mat-label>
                <mat-select id="conditions-{{doi}}-key" formControlName="key">
                  <mat-option *ngFor="let conditionalQuestion of dfeSvc.getQuestionsForConditions(s, this.getSectionConditionsSection(doi).getRawValue())" [value]="conditionalQuestion">
                    {{ conditionalQuestion }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
    
              <mat-form-field [appearance]="'outline'">
                <mat-label attr.for="conditions-{{doi}}-key">Value</mat-label>
                <mat-select id="conditions-{{doi}}-value" formControlName="value">
                  <mat-option *ngFor="let option of dfeSvc.getValuesForConditions(s, this.getSectionConditionsSection(doi).getRawValue(), this.getSectionConditionsQuestion(doi).getRawValue())" [value]="option.key">
                    {{ option.value }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
    
              <button type="button" mat-icon-button color="warn" (click)="onClickRemoveSectionCondition(doi)">
                <mat-icon>delete</mat-icon>
              </button>
    
              <button type="button" mat-icon-button color="primary" (click)="onClickAddSectionCondition(doi)">
                <mat-icon>add</mat-icon>
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </mat-tab>

    <mat-tab [label]="'Question: ' + secEditQuestionKey.getRawValue()" *ngIf="selectedTabIndex > 1">
      <app-dynamic-form-edit-questions [fb]="fb" [fg]="fg" [i]="secEditIdx" [qi]="qEditIdx"></app-dynamic-form-edit-questions>
    </mat-tab>
  </mat-tab-group>
  </div>`
})
export class DynamicFormEditSectionsComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;
  get s(): FormArray { return this.fg.get("sections") as FormArray; }
  protected secEdit!: FormGroup;
  protected secEditIdx!: number;
  protected qEditIdx!: number;
  protected get secEditConditions(): FormArray { return this.secEdit.get("conditions") as FormArray; }
  protected get secEditKey(): FormControl { return this.secEdit.get("key") as FormControl; }
  
  protected get secEditQuestions(): FormArray { return this.secEdit.get("questions") as FormArray; }
  protected get secEditQuestion(): FormGroup { return (this.secEditQuestions).at(this.qEditIdx) as FormGroup; }
  protected get secEditQuestionKey(): FormControl { return this.secEditQuestion.get("key") as FormControl; }

  protected selectedTabIndex: number = 0;

  constructor(protected dfeSvc: DynamicFormEditService, private dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.secEdit = this.dfeSvc.getSection(this.s, 0);
  }

  protected onClickEditSectionKey(): void {
    const dialogRef = this.dialog.open(EditSectionKeyDialog, { data: { 
      secIdx: this.secEditIdx, 
      secKey: this.secEditKey.getRawValue(), 
      invalid: (this.s.getRawValue() as DynamicFormSection[]).map(section => section.key) 
    } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.secEditKey.patchValue(result);
      }
    });
  }

  protected getSectionConditionsSection(dpdsIdx: number): FormControl { return this.secEditConditions.at(dpdsIdx).get("section") as FormControl; }
  protected getSectionConditionsQuestion(dpdsIdx: number): FormControl { return this.secEditConditions.at(dpdsIdx).get("key") as FormControl; }

  protected onClickAddSection(): void { this.s.push(this.dfeSvc.sectionToGroup(this.fb, new DynamicFormSection())); }
  protected onClickRemoveSection(secIdx: number): void { this.s.removeAt(secIdx); }
  protected onClickEditSection(secEditIdx: number): void {
    this.secEditIdx = secEditIdx;
    this.secEdit = this.dfeSvc.getSection(this.s, this.secEditIdx);
    this.selectedTabIndex = 1;
  }

  protected onClickAddSectionCondition(doIdx: number): void { this.secEditConditions.insert(doIdx, this.dfeSvc.sectionConditionsToGroup(this.fb, {key: "", section: "", value: ""})); }
  protected onClickRemoveSectionCondition(doi: number): void { this.secEditConditions.removeAt(doi); }

  protected onClickAddQuestion(): void{ this.secEditQuestions.push(this.dfeSvc.questionToGroup(this.fb, new DynamicFormQuestion())); }
  protected onClickEditQuestion(qi: number): void {
    this.qEditIdx = qi;
    this.selectedTabIndex = 2;
  }
  protected onClickRemoveQuestion(qIdx: number): void { this.secEditQuestions.removeAt(qIdx); }

  protected flatten(strings: string[]): string {
    return [... new Set(strings)].join(", ");
  }

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

    (secForm.get("questions") as FormArray).controls.forEach((question, qIdx) => {
      this.getQuestionErrors(qIdx).forEach(questionError => errs.push(questionError));
    })

    return errs;
  }

  reorderSections(event: CdkDragDrop<string[]>) { moveItemInArray(this.s.controls, event.previousIndex, event.currentIndex); }
  reorderQuestions(event: CdkDragDrop<string[]>) { moveItemInArray(this.secEditQuestions.controls, event.previousIndex, event.currentIndex); }
}


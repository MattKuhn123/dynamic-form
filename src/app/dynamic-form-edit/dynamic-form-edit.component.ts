import { Component, OnInit } from '@angular/core';
import { DynamicFormService } from '../shared/dynamic-form.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DynamicFormQuestion } from '../dynamic-form/dynamic-form-question.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DynamicFormSection } from '../dynamic-form/dynamic-form-section.model';
import { MatDialog } from '@angular/material/dialog';
import { EditSectionKeyDialog } from './edit-section-key.component';
import { EditQuestionKeyDialog } from './edit-question-key.component';

@Component({
  selector: 'app-dynamic-form-edit',
  styles: [
    'mat-panel-description { display: flex; gap: 5px; flex-wrap: wrap; }',
    'footer { position: fixed; bottom: 10px; text-align: center; width: 100%; }',
  ],
  template: `
    <form *ngIf="fg" [formGroup]="fg">
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
          <mat-accordion formArrayName="sections">
            <mat-expansion-panel *ngFor="let section of sections.controls; let i = index" [formGroupName]="i" #secPanel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  Section {{ i+1 }}: {{ getSectionKey(i).getRawValue() }}
                </mat-panel-title>
                <mat-panel-description>
                  <button mat-icon-button [color]="secPanel.expanded ? 'primary' : 'none'" matTooltip="questions">
                    <mat-icon [matBadge]="getQuestions(i).length" matBadgeColor="accent" matBadgeOverlap="false" matBadgeSize="small">question_answer</mat-icon>
                  </button>
                  <button mat-icon-button [color]="secPanel.expanded ? 'primary' : 'none'" matTooltip="required" *ngIf="getSectionRequired(i).getRawValue()">
                    <mat-icon>priority_high</mat-icon>
                  </button>
                  <button mat-icon-button [color]="secPanel.expanded ? 'primary' : 'none'" matTooltip="conditions" *ngIf="getSectionConditionsList(i).length > 0">
                    <mat-icon [matBadge]="getSectionConditionsList(i).length" matBadgeColor="accent" matBadgeOverlap="false" matBadgeSize="small">rule</mat-icon>
                  </button>
                  <button mat-icon-button [color]="secPanel.expanded ? 'warn' : 'none'" matTooltip="delete" (click)="onClickRemoveSection(i)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-panel-description>
              </mat-expansion-panel-header>

              <mat-stepper orientation="vertical">
                <mat-step>
                  <ng-template matStepLabel>Section Properties</ng-template>
                  <div>
                    <mat-form-field>
                      <mat-label attr.for="section-{{i}}-key">Key</mat-label>
                      <input matInput formControlName="key" id="section-{{i}}-key" type="text"/>
                      <mat-icon matSuffix color="primary" matTooltip="edit" (click)="onClickEditSectionKey(i)">edit</mat-icon>
                    </mat-form-field>
                  </div>
                  <div>
                    <mat-label attr.for="section-{{i}}-required">
                      <mat-checkbox formControlName="required" id="section-{{i}}-required"></mat-checkbox>
                      Section is required
                    </mat-label>
                  </div>
                  <div>
                    <mat-label attr.for="section-{{i}}-list">
                      <mat-checkbox formControlName="list" id="section-{{i}}-list"></mat-checkbox>
                      Section is list
                    </mat-label>
                  </div>
                  <div>
                    <mat-form-field>
                      <mat-label attr.for="section-{{i}}-description">Description</mat-label>
                      <textarea matInput formControlName="description" id="section-{{i}}-description" type="text"></textarea>
                    </mat-form-field>
                  </div>
                </mat-step>
                
                <mat-step>
                  <ng-template matStepLabel>Section Questions</ng-template>
                  <mat-accordion formArrayName="questions">
                    <mat-expansion-panel *ngFor="let question of getQuestions(i).controls; let qi = index" [formGroupName]="qi" #qtnPanel>
                      <mat-expansion-panel-header>
                        <mat-panel-title>
                        Question {{ qi+1 }}: {{ getQuestionLabel(i, qi).getRawValue() }}
                        </mat-panel-title>

                        <mat-panel-description>
                          <button mat-icon-button [color]="qtnPanel.expanded ? 'primary' : 'none'" matTooltip="required" *ngIf="getQuestionRequired(i, qi).getRawValue()">
                            <mat-icon>priority_high</mat-icon>
                          </button>

                          <button mat-icon-button [color]="qtnPanel.expanded ? 'primary' : 'none'" matTooltip="conditions" *ngIf="getQuestionConditionsList(i, qi).length > 0">
                            <mat-icon [matBadge]="getQuestionConditionsList(i, qi).length" matBadgeColor="accent" matBadgeOverlap="false" matBadgeSize="small">rule</mat-icon>
                          </button>

                          <button mat-icon-button [color]="qtnPanel.expanded ? 'warn' : 'none'" matTooltip="delete" (click)="onClickRemoveQuestion(i, qi)">
                            <mat-icon>delete</mat-icon>
                          </button>
                        </mat-panel-description>
                      </mat-expansion-panel-header>
  
                      <mat-stepper orientation="vertical">
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

                        <mat-step label="Question Options" formArrayName="options" *ngIf="isQuestionOptionable(i, qi)">
                          <div *ngIf="getQuestionOptions(i, qi).controls.length === 0">
                            <em>This question has no options.</em>
                          </div>
    
                          <div *ngFor="let questionOptions of getQuestionOptions(i, qi).controls; let qoi = index">
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

                        <mat-step [label]="getQuestionConditionsList(i, qi).controls.length === 0 ? 'Question Conditions (None)' : 'Question Conditions'">
                          <div *ngIf="getQuestionConditionsList(i, qi).controls.length === 0">
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
                            <div *ngFor="let questionConditions of getQuestionConditionsList(i, qi).controls; let qdoi = index" [formGroupName]="qdoi">
                              <mat-form-field>
                                <mat-label attr.for="question-conditions-{{i}}-{{qdoi}}-key">Question</mat-label>
                                <mat-select id="question-conditions-{{i}}-{{qdoi}}-key" formControlName="key">
                                  <mat-option *ngFor="let conditionalQuestion of getQuestionsForConditions(getSectionKey(i).getRawValue())" [value]="conditionalQuestion.key">
                                    {{ conditionalQuestion.label }}
                                  </mat-option>
                                </mat-select>
                              </mat-form-field>
  
                              <mat-form-field>
                                <mat-label attr.for="question-conditions-{{i}}-{{qdoi}}-value">Value</mat-label>
                                <mat-select id="question-conditions-{{i}}-{{qdoi}}-value" formControlName="value">
                                  <mat-option *ngFor="let option of getValuesForConditions(getSectionKey(i).getRawValue(), getQuestionConditionsQuestion(i, qi, qdoi).value)" [value]="option.key">
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
                </mat-step>

                <mat-step formArrayName="conditions" [label]="getSectionConditionsList(i).controls.length === 0 ? 'Section Conditions (None)' : 'Section Conditions'">
                  <div *ngIf="getSectionConditionsList(i).controls.length === 0">
                    <div>
                      <em>There are no conditions under which this section will be displayed, so it will always be displayed by default.</em>
                    </div>
                    <div>
                      <button mat-button color="primary" (click)="onClickAddSectionCondition(i, 0)">
                        Add condition
                      </button>
                    </div>
                  </div>
                  <div *ngFor="let conditions of getSectionConditionsList(i).controls; let doi = index">
                    <div [formGroupName]="doi">
                      <mat-form-field>
                        <mat-label attr.for="conditions-{{i}}-{{doi}}-section">Section</mat-label>
                        <mat-select id="conditions-{{i}}-{{doi}}-section" formControlName="section">
                          <mat-option *ngFor="let key of getSectionsForSectionConditions()" [value]="key">{{ key }}</mat-option>
                        </mat-select>
                      </mat-form-field>

                      <mat-form-field>
                        <mat-label attr.for="conditions-{{i}}-{{doi}}-key">Question</mat-label>
                        <mat-select id="conditions-{{i}}-{{doi}}-key" formControlName="key">
                          <mat-option *ngFor="let conditionalQuestion of getQuestionsForConditions(getSectionConditionsSection(i, doi).getRawValue())" [value]="conditionalQuestion.key">
                            {{ conditionalQuestion.label }}
                          </mat-option>
                        </mat-select>
                      </mat-form-field>

                      <mat-form-field>
                        <mat-label attr.for="conditions-{{i}}-{{doi}}-key">Value</mat-label>
                        <mat-select id="conditions-{{i}}-{{doi}}-value" formControlName="value">
                          <mat-option *ngFor="let option of getValuesForConditions(getSectionConditionsSection(i, doi).getRawValue(), getSectionConditionsQuestion(i, doi).getRawValue())" [value]="option.key">
                            {{ option.value }}
                          </mat-option>
                        </mat-select>
                      </mat-form-field>
  
                      <button mat-icon-button color="warn" (click)="onClickRemoveSectionCondition(i, doi)">
                        <mat-icon>delete</mat-icon>
                      </button>

                      <button mat-icon-button color="primary" (click)="onClickAddSectionCondition(i, doi)">
                        <mat-icon>add</mat-icon>
                      </button>
                    </div>
                  </div>
                </mat-step>
              </mat-stepper>

            </mat-expansion-panel>
          </mat-accordion>
        </mat-card-content>
        <mat-card-actions>
          <button type="button" (click)="onClickAddSection()" mat-stroked-button color="primary">Add</button>
        </mat-card-actions>
      </mat-card>
    </form>

    <mat-card>
      <mat-card-content>
        <pre *ngIf="fg"> {{ stringified }} </pre>
      </mat-card-content>
    </mat-card>
    
    <mat-sidenav-container>
      <footer>
        <button mat-raised-button color="primary" *ngIf="fg" [cdkCopyToClipboard]="stringified" (click)="onClickSave()">Save</button>
      </footer>
    </mat-sidenav-container>
  `,
})
export class DynamicFormEditComponent implements OnInit {
  fg!: FormGroup;
  get stringified(): string { return JSON.stringify(this.fg.getRawValue(), null, 4) };
  get sections(): FormArray { return this.fg.get("sections") as FormArray; }
  
  protected getSection(secIdx: number): FormGroup { return (this.sections.at(secIdx) as FormGroup) }
  protected getSectionKey(secIdx: number): FormControl { return (this.getSection(secIdx).get("key") as FormControl) }
  protected getSectionRequired(secIdx: number): FormControl { return (this.getSection(secIdx).get("required") as FormControl) }
  protected getSectionConditionsList(secIdx: number): FormArray { return (this.getSection(secIdx)).get("conditions") as FormArray; }
  protected getSectionConditionsItem(secIdx: number, dpdsIdx: number): FormGroup { return this.getSectionConditionsList(secIdx).at(dpdsIdx) as FormGroup; }
  protected getSectionConditionsSection(secIdx: number, dpdsIdx: number): FormControl { return this.getSectionConditionsItem(secIdx, dpdsIdx).get("section") as FormControl; }
  protected getSectionConditionsQuestion(secIdx: number, dpdsIdx: number): FormControl { return this.getSectionConditionsItem(secIdx, dpdsIdx).get("key") as FormControl; }
  protected getSectionConditionsValue(secIdx: number, dpdsIdx: number): FormControl { return this.getSectionConditionsItem(secIdx, dpdsIdx).get("value") as FormControl; }
  
  protected getQuestions(secIdx: number): FormArray { return (this.getSection(secIdx)).get("questions") as FormArray; }
  protected getQuestion(secIdx: number, qIdx: number): FormGroup { return this.getQuestions(secIdx).at(qIdx) as FormGroup }
  protected getQuestionKey(secIdx: number, qIdx: number): FormControl { return (this.getQuestion(secIdx, qIdx).get("key") as FormControl); }
  protected getQuestionCtrlType(secIdx: number, qIdx: number): FormControl { return (this.getQuestion(secIdx, qIdx).get("controlType") as FormControl); }
  protected getQuestionLabel(secIdx: number, qIdx: number): FormControl { return (this.getQuestion(secIdx, qIdx).get("label") as FormControl); }
  protected getQuestionRequired(secIdx: number, qIdx: number): FormControl { return (this.getQuestion(secIdx, qIdx).get("required") as FormControl); }
  
  protected getQuestionOptions(secIdx: number, qIdx: number): FormArray { return this.getQuestion(secIdx, qIdx).get("options") as FormArray; }
  protected getQuestionOption(secIdx: number, qIdx: number, optIdx: number): FormControl { return (this.getQuestion(secIdx, qIdx).get("options") as FormArray).at(optIdx) as FormControl }
  
  protected getQuestionConditionsList(secIdx: number, qIdx: number): FormArray { return this.getQuestion(secIdx, qIdx).get("conditions") as FormArray; }
  protected getQuestionConditionsItem(secIdx: number, qIdx: number, dpdsIdx: number): FormControl { return this.getQuestionConditionsList(secIdx, qIdx).at(dpdsIdx) as FormControl; }
  protected getQuestionConditionsQuestion(secIdx: number, qIdx: number, dpdsIdx: number): FormControl { return this.getQuestionConditionsItem(secIdx, qIdx, dpdsIdx).get("key") as FormControl; }
  protected getQuestionConditionsValue(secIdx: number, qIdx: number, dpdsIdx: number): FormControl { return this.getQuestionConditionsItem(secIdx, qIdx, dpdsIdx).get("value") as FormControl; }
  
  protected getSectionsForSectionConditions(): string[] {
    const sections: DynamicFormSection[] = this.sections.getRawValue() as DynamicFormSection[];
    const keys: string[] = sections.map(section => section.key);
    return keys;
  }
  protected getQuestionsForConditions(secKey: string): DynamicFormQuestion[] {
    const secIdx = this.getIndexOfSection(secKey);
    const sec = this.getQuestions(secIdx).value as DynamicFormQuestion[];
    return sec.filter(question => ["radio", "dropdown", "checkbox"].findIndex(ctrlType => ctrlType === question.controlType) > -1);
  }
  
  protected getValuesForConditions(secKey: string, qKey: string): { key: string, value: string }[] {
    const secIdx = this.getIndexOfSection(secKey);
    return this.getQuestionOptions(secIdx, this.getIndexOfQuestionInSection(secIdx, qKey)).value;
  }

  protected isQuestionOptionable(secIdx: number, qIdx: number): boolean { return ["radio", "dropdown"].findIndex(ctrlType => ctrlType === this.getQuestionCtrlType(secIdx, qIdx).value) > -1; }
  
  private getIndexOfQuestionInSection(secIdx: number, qKey: string): number { return (this.getQuestions(secIdx).getRawValue() as DynamicFormQuestion[]).findIndex(question => question.key === qKey); }
  private getIndexOfSection(sKey: string): number { return (this.sections.getRawValue() as DynamicFormSection[]).findIndex(section => section.key === sKey); }

  constructor(private dfSvc: DynamicFormService, private fb: FormBuilder, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.dfSvc.getForm().subscribe(form => {
      this.fg = this.fb.group({
        title: this.fb.control(form.title || ""),
        description: this.fb.control(form.description || ""),
        sections: this.fb.array(form.sections.map(section => this.sectionToGroup(section)) || [])
      });
    });
  }

  private sectionToGroup(section: DynamicFormSection): FormGroup {
    return this.fb.group({
      key: this.fb.control({value: section.key || "", disabled: true}),
      description: this.fb.control(section.description || ""),
      list: this.fb.control(section.list || false),
      required: this.fb.control(section.required || false),
      conditions: this.fb.array(section.conditions.map((condition: any) => this.sectionConditionsToGroup(condition))),
      questions: this.fb.array(section.questions.map(question => this.questionToGroup(question)))
    });
  }

  private sectionConditionsToGroup(condition: { key: string, section: string, value: string }): FormGroup {
    return this.fb.group({
      key: this.fb.control(condition.key || ""),
      section: this.fb.control(condition.section || 0),
      value: this.fb.control(condition.value || ""),
    })
  }

  private questionToGroup(question: DynamicFormQuestion): FormGroup {
    return this.fb.group({
      controlType: this.fb.control(question.controlType || ""),
      conditions: this.fb.array(question.conditions.map(condition => this.questionConditionsToGroup(condition))),
      key: this.fb.control({value: question.key || "", disabled: true}),
      label: this.fb.control(question.label || ""),
      options: this.fb.array(question.options.map(option => this.questionOptionToGroup(option)) || []),
      required: this.fb.control(question.required || ""),
      type: this.fb.control(question.type || ""),
    })
  }

  private questionConditionsToGroup(condition: { key: string, value: string }): FormGroup {
    return this.fb.group({
      key: this.fb.control(condition.key || ""),
      value: this.fb.control(condition.value || ""),
    });
  }

  private questionOptionToGroup(option: { key: string, value: string }): FormGroup {
    return this.fb.group({
      key: option.key,
      value: option.value
    });
  }

  protected onClickSave(): void {
    this.dfSvc.setForm(this.fg.getRawValue());
    this.snackBar.open("Saved!", "OK");
  }

  protected onClickEditSectionKey(secIdx: number): void {
    const dialogRef = this.dialog.open(EditSectionKeyDialog, { data: { 
      secIdx: secIdx, 
      secKey: this.getSectionKey(secIdx).getRawValue(), 
      invalid: (this.sections.getRawValue() as DynamicFormSection[]).map(section => section.key) 
    } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSectionKey(secIdx).setValue(result);
      }
    });
  }

    protected onClickEditQuestionKey(secIdx: number, qIdx: number): void {
    const dialogRef = this.dialog.open(EditQuestionKeyDialog, { data: { 
      secIdx: secIdx, 
      secKey: this.getSectionKey(secIdx).getRawValue(), 
      qKey: this.getQuestionKey(secIdx, qIdx).getRawValue(), 
      qIdx: qIdx, 
      invalid: (this.sections.getRawValue() as DynamicFormSection[]).map(section => section.questions).flat().map(question => question.key)
    } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getQuestionKey(secIdx, qIdx).setValue(result);
      }
    });
  }

  protected onClickAddSection(): void { this.sections.push(this.sectionToGroup(new DynamicFormSection())); }
  protected onClickRemoveSection(secIdx: number): void { this.sections.removeAt(secIdx); }

  protected onClickAddSectionCondition(secIdx: number, doIdx: number): void { this.getSectionConditionsList(secIdx).insert(doIdx, this.sectionConditionsToGroup({key: "", section: "", value: ""})); }
  protected onClickRemoveSectionCondition(secIdx: number, doi: number): void { this.getSectionConditionsList(secIdx).removeAt(doi); }

  protected onClickAddQuestion(secIdx: number): void{ this.getQuestions(secIdx).push(this.questionToGroup(new DynamicFormQuestion())); }
  protected onClickRemoveQuestion(secIdx: number, qIdx: number): void { this.getQuestions(secIdx).removeAt(qIdx); }

  protected onClickAddQuestionCondition(secIdx: number, qIdx: number, dpdsIdx: number): void { this.getQuestionConditionsList(secIdx, qIdx).insert(dpdsIdx, this.questionConditionsToGroup({key: "", value: ""})); }
  protected onClickRemoveQuestionCondition(secIdx: number, qIdx: number, dpdsIdx: number): void { this.getQuestionConditionsList(secIdx, qIdx).removeAt(dpdsIdx); }

  protected onClickAddQuestionOption(secIdx: number, qIdx: number, qoIdx: number): void { this.getQuestionOptions(secIdx, qIdx).insert(qoIdx, this.questionOptionToGroup({key: "", value: ""})); }
  protected onClickRemoveQuestionOption(secIdx: number, qIdx: number, qoIdx: number): void { this.getQuestionOptions(secIdx, qIdx).removeAt(qoIdx); }
}
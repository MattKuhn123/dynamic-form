import { Component, Inject, OnInit } from '@angular/core';
import { DynamicFormService } from '../shared/dynamic-form.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicFormQuestion } from '../dynamic-form/dynamic-form-question.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DynamicFormSection } from '../dynamic-form/dynamic-form-section.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { createUniqueValidator } from '../shared/unique-value.validator';

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
                  Section {{ i+1 }}: {{ getSectionTitle(i).getRawValue() }}
                </mat-panel-title>
                <mat-panel-description>
                  <button mat-icon-button [color]="secPanel.expanded ? 'primary' : 'none'" matTooltip="questions">
                    <mat-icon [matBadge]="getQuestions(i).length" matBadgeColor="accent" matBadgeOverlap="false" matBadgeSize="small">question_answer</mat-icon>
                  </button>
                  <button mat-icon-button [color]="secPanel.expanded ? 'primary' : 'none'" matTooltip="required" *ngIf="getSectionRequired(i).getRawValue()">
                    <mat-icon>priority_high</mat-icon>
                  </button>
                  <button mat-icon-button [color]="secPanel.expanded ? 'primary' : 'none'" matTooltip="conditions" *ngIf="getSectionDependsOnList(i).length > 0">
                    <mat-icon [matBadge]="getSectionDependsOnList(i).length" matBadgeColor="accent" matBadgeOverlap="false" matBadgeSize="small">rule</mat-icon>
                  </button>
                  <button mat-icon-button [color]="secPanel.expanded ? 'warn' : 'none'" matTooltip="delete" (click)="onClickRemoveSection(i)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-panel-description>
              </mat-expansion-panel-header>

              <mat-stepper orientation="vertical">
                <!-- SECTION PROPERTIES -->
                <!-- SECTION PROPERTIES -->
                <mat-step>
                  <ng-template matStepLabel>Section Properties</ng-template>
                  <div>
                    <mat-form-field>
                      <mat-label attr.for="section-{{i}}-key">Key</mat-label>
                      <input matInput formControlName="key" id="section-{{i}}-key" type="text"/>
                    </mat-form-field>
                    <button mat-icon-button color="primary" matTooltip="edit" (click)="onClickEditSectionKey(i)">
                      <mat-icon>edit</mat-icon>
                    </button>
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
                
                <!-- SECTION QUESTIONS -->
                <!-- SECTION QUESTIONS -->
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

                          <button mat-icon-button [color]="qtnPanel.expanded ? 'primary' : 'none'" matTooltip="conditions" *ngIf="getQuestionDependsOnList(i, qi).length > 0">
                            <mat-icon [matBadge]="getQuestionDependsOnList(i, qi).length" matBadgeColor="accent" matBadgeOverlap="false" matBadgeSize="small">rule</mat-icon>
                          </button>

                          <button mat-icon-button [color]="qtnPanel.expanded ? 'warn' : 'none'" matTooltip="delete" (click)="onClickRemoveQuestion(i, qi)">
                            <mat-icon>delete</mat-icon>
                          </button>
                        </mat-panel-description>
                      </mat-expansion-panel-header>
  
                      <mat-stepper orientation="vertical" #qtnStepper>
                        <!-- QUESTION PROPERTIES -->
                        <!-- QUESTION PROPERTIES -->
                        <mat-step label="Question Properties">
                          <div>
                            <mat-form-field>
                              <mat-label attr.for="question-{{i}}-{{qi}}-key">Key</mat-label>
                              <input matInput formControlName="key" id="question-{{i}}-{{qi}}-key" type="text" />
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
  
                        <!-- QUESTION OPTIONS -->
                        <!-- QUESTION OPTIONS -->
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

                        <!-- QUESTION DEPENDS ON -->
                        <!-- QUESTION DEPENDS ON -->
                        <mat-step [label]="getQuestionDependsOnList(i, qi).controls.length === 0 ? 'Question Conditions (None)' : 'Question Conditions'">
                          <div *ngIf="getQuestionDependsOnList(i, qi).controls.length === 0">
                            <div>
                              <em>There are no conditions under which this question will be displayed, so it will always be displayed by default.</em>
                            </div>
                            <div>
                              <button mat-button color="primary" (click)="onClickAddQuestionDependency(i, qi, 0)">
                                Add condition
                              </button>
                            </div>
                          </div>
                          <div formArrayName="dependsOn">
                            <div *ngFor="let questionDependsOn of getQuestionDependsOnList(i, qi).controls; let qdoi = index" [formGroupName]="qdoi">
                              <mat-form-field>
                                <mat-label attr.for="question-dependsOn-{{i}}-{{qdoi}}-key">Question</mat-label>
                                <mat-select id="question-dependsOn-{{i}}-{{qdoi}}-key" formControlName="key">
                                  <mat-option *ngFor="let dependableQuestion of getQuestionsForDependsOn(getSectionTitle(i).getRawValue())" [value]="dependableQuestion.key">
                                    {{ dependableQuestion.label }}
                                  </mat-option>
                                </mat-select>
                              </mat-form-field>
  
                              <mat-form-field>
                                <mat-label attr.for="question-dependsOn-{{i}}-{{qdoi}}-value">Value</mat-label>
                                <mat-select id="question-dependsOn-{{i}}-{{qdoi}}-value" formControlName="value">
                                  <mat-option *ngFor="let option of getValuesForDependsOn(getSectionTitle(i).getRawValue(), getQuestionDependsOnQuestion(i, qi, qdoi).value)" [value]="option.key">
                                    {{ option.value }}
                                  </mat-option>
                                </mat-select>
                              </mat-form-field>
  
                              <button mat-icon-button color="warn" (click)="onClickRemoveQuestionDependency(i, qi, qdoi)">
                                <mat-icon>delete</mat-icon>
                              </button>

                              <button mat-icon-button color="primary" (click)="onClickAddQuestionDependency(i, qi, qdoi)">
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

                <!-- SECTION DEPENDS ON -->
                <!-- SECTION DEPENDS ON -->
                <mat-step formArrayName="dependsOn" [label]="getSectionDependsOnList(i).controls.length === 0 ? 'Section Conditions (None)' : 'Section Conditions'">
                  <div *ngIf="getSectionDependsOnList(i).controls.length === 0">
                    <div>
                      <em>There are no conditions under which this section will be displayed, so it will always be displayed by default.</em>
                    </div>
                    <div>
                      <button mat-button color="primary" (click)="onClickAddSectionDependency(i, 0)">
                        Add condition
                      </button>
                    </div>
                  </div>
                  <div *ngFor="let dependsOn of getSectionDependsOnList(i).controls; let doi = index">
                    <div [formGroupName]="doi">
                      <mat-form-field>
                        <mat-label attr.for="dependsOn-{{i}}-{{doi}}-section">Section</mat-label>
                        <mat-select id="dependsOn-{{i}}-{{doi}}-section" formControlName="section">
                          <mat-option *ngFor="let key of getSectionsForSectionDependsOn()" [value]="key">{{ key }}</mat-option>
                        </mat-select>
                      </mat-form-field>

                      <mat-form-field>
                        <mat-label attr.for="dependsOn-{{i}}-{{doi}}-key">Question</mat-label>
                        <mat-select id="dependsOn-{{i}}-{{doi}}-key" formControlName="key">
                          <mat-option *ngFor="let dependableQuestion of getQuestionsForDependsOn(getSectionDependsOnSection(i, doi).value)" [value]="dependableQuestion.key">
                            {{ dependableQuestion.label }}
                          </mat-option>
                        </mat-select>
                      </mat-form-field>

                      <mat-form-field>
                        <mat-label attr.for="dependsOn-{{i}}-{{doi}}-key">Value</mat-label>
                        <mat-select id="dependsOn-{{i}}-{{doi}}-value" formControlName="value">
                          <mat-option *ngFor="let option of getValuesForDependsOn(getSectionDependsOnSection(i, doi).value, getSectionDependsOnQuestion(i, doi).value)" [value]="option.key">
                            {{ option.value }}
                          </mat-option>
                        </mat-select>
                      </mat-form-field>
  
                      <button mat-icon-button color="warn" (click)="onClickRemoveSectionDependency(i, doi)">
                        <mat-icon>delete</mat-icon>
                      </button>

                      <button mat-icon-button color="primary" (click)="onClickAddSectionDependency(i, doi)">
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
  protected getSectionTitle(secIdx: number): FormControl { return (this.getSection(secIdx).get("key") as FormControl) }
  protected getSectionRequired(secIdx: number): FormControl { return (this.getSection(secIdx).get("required") as FormControl) }
  protected getSectionDependsOnList(secIdx: number): FormArray { return (this.getSection(secIdx)).get("dependsOn") as FormArray; }
  protected getSectionDependsOnItem(secIdx: number, dpdsIdx: number): FormGroup { return this.getSectionDependsOnList(secIdx).at(dpdsIdx) as FormGroup; }
  protected getSectionDependsOnSection(secIdx: number, dpdsIdx: number): FormControl { return this.getSectionDependsOnItem(secIdx, dpdsIdx).get("section") as FormControl; }
  protected getSectionDependsOnQuestion(secIdx: number, dpdsIdx: number): FormControl { return this.getSectionDependsOnItem(secIdx, dpdsIdx).get("key") as FormControl; }
  protected getSectionDependsOnValue(secIdx: number, dpdsIdx: number): FormControl { return this.getSectionDependsOnItem(secIdx, dpdsIdx).get("value") as FormControl; }
  
  protected getQuestions(secIdx: number): FormArray { return (this.getSection(secIdx)).get("questions") as FormArray; }
  protected getQuestion(secIdx: number, qIdx: number): FormGroup { return this.getQuestions(secIdx).at(qIdx) as FormGroup }
  protected getQuestionCtrlType(secIdx: number, qIdx: number): FormControl { return (this.getQuestion(secIdx, qIdx).get("controlType") as FormControl); }
  protected getQuestionLabel(secIdx: number, qIdx: number): FormControl { return (this.getQuestion(secIdx, qIdx).get("label") as FormControl); }
  protected getQuestionRequired(secIdx: number, qIdx: number): FormControl { return (this.getQuestion(secIdx, qIdx).get("required") as FormControl); }
  
  protected getQuestionOptions(secIdx: number, qIdx: number): FormArray { return this.getQuestion(secIdx, qIdx).get("options") as FormArray; }
  protected getQuestionOption(secIdx: number, qIdx: number, optIdx: number): FormControl { return (this.getQuestion(secIdx, qIdx).get("options") as FormArray).at(optIdx) as FormControl }
  
  protected getQuestionDependsOnList(secIdx: number, qIdx: number): FormArray { return this.getQuestion(secIdx, qIdx).get("dependsOn") as FormArray; }
  protected getQuestionDependsOnItem(secIdx: number, qIdx: number, dpdsIdx: number): FormControl { return this.getQuestionDependsOnList(secIdx, qIdx).at(dpdsIdx) as FormControl; }
  protected getQuestionDependsOnQuestion(secIdx: number, qIdx: number, dpdsIdx: number): FormControl { return this.getQuestionDependsOnItem(secIdx, qIdx, dpdsIdx).get("key") as FormControl; }
  protected getQuestionDependsOnValue(secIdx: number, qIdx: number, dpdsIdx: number): FormControl { return this.getQuestionDependsOnItem(secIdx, qIdx, dpdsIdx).get("value") as FormControl; }
  
  protected getSectionsForSectionDependsOn(): string[] {
    const sections: DynamicFormSection[] = this.sections.value as DynamicFormSection[];
    const titles : string[] = sections.map(section => section.key);
    return titles
  }
  protected getQuestionsForDependsOn(secTitle: string): DynamicFormQuestion[] {
    const secIdx = this.getIndexOfSection(secTitle);
    const sec = this.getQuestions(secIdx).value as DynamicFormQuestion[];
    return sec.filter(question => ["radio", "dropdown", "checkbox"].findIndex(ctrlType => ctrlType === question.controlType) > -1);
  }
  
  protected getValuesForDependsOn(secTitle: string, qKey: string): { key: string, value: string }[] {
    const secIdx = this.getIndexOfSection(secTitle);
    return this.getQuestionOptions(secIdx, this.getIndexOfQuestionInSection(secIdx, qKey)).value;
  }

  protected isQuestionOptionable(secIdx: number, qIdx: number): boolean { return ["radio", "dropdown"].findIndex(ctrlType => ctrlType === this.getQuestionCtrlType(secIdx, qIdx).value) > -1; }
  
  private getIndexOfQuestionInSection(secIdx: number, qKey: string): number { return (this.getQuestions(secIdx).value as DynamicFormQuestion[]).findIndex(question => question.key === qKey); }
  private getIndexOfSection(sKey: string): number { return (this.sections.value as DynamicFormSection[]).findIndex(section => section.key === sKey); }

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
      dependsOn: this.fb.array(section.dependsOn.map((depends: any) => this.sectionDependsOnToGroup(depends))),
      questions: this.fb.array(section.questions.map(question => this.questionToGroup(question)))
    });
  }

  private sectionDependsOnToGroup(depends: { key: string, section: string, value: string }): FormGroup {
    return this.fb.group({
      key: this.fb.control(depends.key || ""),
      section: this.fb.control(depends.section || 0),
      value: this.fb.control(depends.value || ""),
    })
  }

  private questionToGroup(question: DynamicFormQuestion): FormGroup {
    return this.fb.group({
      controlType: this.fb.control(question.controlType || ""),
      dependsOn: this.fb.array(question.dependsOn.map(depends => this.questionDependsOnToGroup(depends))),
      key: this.fb.control(question.key || ""),
      label: this.fb.control(question.label || ""),
      options: this.fb.array(question.options.map(option => this.questionOptionToGroup(option)) || []),
      required: this.fb.control(question.required || ""),
      type: this.fb.control(question.type || ""),
    })
  }

  private questionDependsOnToGroup(depends: { key: string, value: string }): FormGroup {
    return this.fb.group({
      key: this.fb.control(depends.key || ""),
      value: this.fb.control(depends.value || ""),
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
    const dialogRef = this.dialog.open(EditSectionKeyDialog, { data: { secIdx: secIdx, secKey: "", invalid: (this.sections.getRawValue() as DynamicFormSection[]).map(section => section.key) } });
    dialogRef.afterClosed().subscribe(result => {
      this.getSectionTitle(secIdx).setValue(result);
    });
  }

  protected onClickAddSection(): void { this.sections.push(this.sectionToGroup(new DynamicFormSection())); }
  protected onClickRemoveSection(secIdx: number): void { this.sections.removeAt(secIdx); }

  protected onClickAddSectionDependency(secIdx: number, doIdx: number): void { this.getSectionDependsOnList(secIdx).insert(doIdx, this.sectionDependsOnToGroup({key: "", section: "", value: ""})); }
  protected onClickRemoveSectionDependency(secIdx: number, doi: number): void { this.getSectionDependsOnList(secIdx).removeAt(doi); }

  protected onClickAddQuestion(secIdx: number): void{ this.getQuestions(secIdx).push(this.questionToGroup(new DynamicFormQuestion())); }
  protected onClickRemoveQuestion(secIdx: number, qIdx: number): void { this.getQuestions(secIdx).removeAt(qIdx); }

  protected onClickAddQuestionDependency(secIdx: number, qIdx: number, dpdsIdx: number): void { this.getQuestionDependsOnList(secIdx, qIdx).insert(dpdsIdx, this.questionDependsOnToGroup({key: "", value: ""})); }
  protected onClickRemoveQuestionDependency(secIdx: number, qIdx: number, dpdsIdx: number): void { this.getQuestionDependsOnList(secIdx, qIdx).removeAt(dpdsIdx); }

  protected onClickAddQuestionOption(secIdx: number, qIdx: number, qoIdx: number): void { this.getQuestionOptions(secIdx, qIdx).insert(qoIdx, this.questionOptionToGroup({key: "", value: ""})); }
  protected onClickRemoveQuestionOption(secIdx: number, qIdx: number, qoIdx: number): void { this.getQuestionOptions(secIdx, qIdx).removeAt(qoIdx); }
}

export interface EditSectionKeyData {
  secIdx: string;
  secKey: string;
  invalid: string[];
}

@Component({
  selector: 'app-edit-section-key-dialog',
  template: `
    <h1 mat-dialog-title>Rename section {{ data.secIdx+1 }}</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>Section Key</mat-label>
        <input matInput [formControl]="fc">
        <mat-error *ngIf="error">{{ getErrorMessage() }}</mat-error>
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onClickCancel()">Cancel</button>
      <button mat-button (click)="onClickOk()" cdkFocusInitial>Ok</button>
    </div>
  `
})
export class EditSectionKeyDialog {
  protected error: boolean = false;
  protected fc: FormControl = new FormControl(this.data.secKey, [Validators.required, createUniqueValidator(this.data.invalid)])
  constructor(public dialogRef: MatDialogRef<EditSectionKeyDialog>, @Inject(MAT_DIALOG_DATA) protected data: EditSectionKeyData) {}
  protected onClickCancel(): void { this.dialogRef.close(); }
  protected onClickOk(): void {
    const exists: boolean = this.data.invalid.findIndex(section => section === this.fc.getRawValue()) > 0;
    if (exists) {
      this.error = true;
    } else {
      this.dialogRef.close(this.fc.value);
    }
  }

  protected getErrorMessage(): string {
    if (this.fc.hasError('required')) {
      return 'You must enter a value';
    }

    return this.fc.hasError('unique') ? 'Key must be unique!' : '';
  }
}
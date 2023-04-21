import { Component, OnInit } from '@angular/core';
import { DynamicFormService } from '../shared/dynamic-form.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DynamicFormQuestion } from '../dynamic-form/dynamic-form-question.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dynamic-form-edit',
  styles: [
    'mat-card-content { display: flex; flex-direction: column; }', 
    'mat-card { margin-top: 5px; }',
    'footer { position: fixed; bottom: 10px; text-align: center; width: 100%; }',
  ],
  template: `
    <form *ngIf="fg" [formGroup]="fg">
      <mat-card>
        <mat-card-content>
          <mat-form-field appearance="fill">
            <mat-label [attr.for]="'title'">Title</mat-label>
            <input matInput [formControlName]="'title'" [id]="'title'" [type]="'text'" />
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label [attr.for]="'description'">Description</mat-label>
            <textarea matInput [formControlName]="'description'" [id]="'description'" [type]="'text'"></textarea>
          </mat-form-field>

          <mat-accordion formArrayName="sections">
            <mat-expansion-panel *ngFor="let section of sections.controls; let i = index" [formGroupName]="i">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  Section {{ i+1 }}
                </mat-panel-title>
              </mat-expansion-panel-header>

              <mat-card>
                <mat-card-header>
                  <mat-card-title>Section Basic Information</mat-card-title>
                  <mat-card-subtitle>Main information about this section</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <mat-form-field appearance="fill">
                    <mat-label [attr.for]="'section-{{i}}-title'">Title</mat-label>
                    <input matInput [formControlName]="'title'" [id]="'section-{{i}}-title'" [type]="'text'" />
                  </mat-form-field>

                  <mat-form-field appearance="fill">
                    <mat-label [attr.for]="'section-{{i}}-description'">Description</mat-label>
                    <textarea matInput [formControlName]="'description'" [id]="'section-{{i}}-description'" [type]="'text'"></textarea>
                  </mat-form-field>

                  <mat-label [attr.for]="'section-{{i}}-required'">Section required:
                    <mat-checkbox [formControlName]="'required'" [id]="'section-{{i}}-required'"></mat-checkbox>
                  </mat-label>

                  <mat-label [attr.for]="'section-{{i}}-list'">Section is list:
                    <mat-checkbox [formControlName]="'list'" [id]="'section-{{i}}-list'"></mat-checkbox>
                  </mat-label>
                </mat-card-content>
              </mat-card>

              <mat-card>
                <mat-card-header>
                  <mat-card-title>Section Depends On</mat-card-title>
                  <mat-card-subtitle>Conditions that determine whether this section will be displayed.</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content formArrayName="dependsOn">
                  <div *ngIf="getSectionDependsOnList(i).controls.length === 0">
                    <em>This section will always be displayed.</em>
                  </div>
  
                  <div *ngFor="let dependsOn of getSectionDependsOnList(i).controls; let doi = index">
                    <div [formGroupName]="doi">
                      <mat-form-field appearance="fill">
                        <mat-label [attr.for]="'dependsOn-{{i}}-{{doi}}-section'">Section index</mat-label>
                        <mat-select id="dependsOn-{{i}}-{{doi}}-section" [formControlName]="'section'">
                          <mat-option *ngFor="let index of getSectionsForSectionDependsOn()" [value]="index-1">{{index}}</mat-option>
                        </mat-select>
                      </mat-form-field>

                      <mat-form-field appearance="fill">
                        <mat-label [attr.for]="'dependsOn-{{i}}-{{doi}}-key'">Question</mat-label>
                        <mat-select [id]="'dependsOn-{{i}}-{{doi}}-key'" [formControlName]="'key'">
                          <mat-option *ngFor="let dependableQuestion of getQuestionsForDependsOn(getSectionDependsOnSection(i, doi).value)" [value]="dependableQuestion">
                            {{ dependableQuestion }}
                          </mat-option>
                        </mat-select>
                      </mat-form-field>

                      <mat-form-field appearance="fill">
                        <mat-label [attr.for]="'dependsOn-{{i}}-{{doi}}-key'">Value</mat-label>
                        <mat-select [id]="'dependsOn-{{i}}-{{doi}}-value'" [formControlName]="'value'">
                          <mat-option *ngFor="let option of getValuesForDependsOn(getSectionDependsOnSection(i, doi).value, getSectionDependsOnQuestion(i, doi).value)" [value]="option.key">
                            {{ option.value }}
                          </mat-option>
                        </mat-select>
                      </mat-form-field>
  
                      <!-- <mat-form-field appearance="fill">
                        <mat-label [attr.for]="'dependsOn-{{i}}-{{doi}}-value'">Value</mat-label>
                        <input matInput [formControlName]="'value'" [id]="'dependsOn-{{i}}-{{doi}}-value'" [type]="'text'" />
                      </mat-form-field> -->
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card>
                <mat-card-header>
                  <mat-card-title>Section Questions</mat-card-title>
                  <mat-card-subtitle>Questions this section displays.</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <mat-accordion formArrayName="questions">
                    <mat-expansion-panel *ngFor="let question of getQuestions(i).controls; let qi = index" [formGroupName]="qi">
                      <mat-expansion-panel-header>
                        <mat-panel-title>
                        Question {{ qi+1 }}
                        </mat-panel-title>
                      </mat-expansion-panel-header>
                      <mat-card>
                        <mat-card-content>
                          <mat-form-field appearance="fill">
                            <mat-label [attr.for]="'question-{{i}}-{{qi}}-key'">Key</mat-label>
                            <input matInput [formControlName]="'key'" [id]="'question-{{i}}-{{doi}}-key'" [type]="'text'" />
                          </mat-form-field>
      
                          <mat-form-field appearance="fill">
                            <mat-label [attr.for]="'question-{{i}}-{{qi}}-controlType'">Control type</mat-label>
                            <mat-select [id]="'question-{{i}}-{{doi}}-controlType'" [formControlName]="'controlType'">
                              <mat-option [value]="'textarea'">textarea</mat-option>
                              <mat-option [value]="'textbox'">textbox</mat-option>
                              <mat-option [value]="'dropdown'">dropdown</mat-option>
                              <mat-option [value]="'checkbox'">checkbox</mat-option>
                              <mat-option [value]="'radio'">radio</mat-option>
                              <mat-option [value]="'date'">date</mat-option>
                              <mat-option [value]="'file'">file</mat-option>
                            </mat-select>
                          </mat-form-field>
      
                          <mat-form-field appearance="fill">
                            <mat-label [attr.for]="'question-{{i}}-{{qi}}-label'">Label</mat-label>
                            <input matInput [formControlName]="'label'" [id]="'question-{{i}}-{{doi}}-label'" [type]="'text'" />
                          </mat-form-field>
      
                          <mat-label [attr.for]="'question-{{i}}-required'">Question required:
                            <mat-checkbox [formControlName]="'required'" [id]="'question-{{i}}-required'"></mat-checkbox>
                          </mat-label>
                          
                          <mat-card formArrayName="dependsOn">
                            <mat-card-header>
                              <mat-card-title>Question Depends On</mat-card-title>
                              <mat-card-subtitle>Conditions that determine whether this question will be displayed.</mat-card-subtitle>
                            </mat-card-header>
                            <mat-card-content>
                              <div *ngIf="getQuestionDependsOnList(i, qi).controls.length === 0">
                                <em>This question will always be displayed.</em>
                              </div>
        
                              <div *ngFor="let questionDependsOn of getQuestionDependsOnList(i, qi).controls; let qdoi = index">
                                <div [formGroupName]="qdoi">
                                  <mat-form-field appearance="fill">
                                    <mat-label [attr.for]="'question-dependsOn-{{i}}-{{qdoi}}-key'">Question</mat-label>
                                    <mat-select [id]="'question-dependsOn-{{i}}-{{qdoi}}-key'" [formControlName]="'key'">
                                      <mat-option *ngFor="let dependableQuestion of getQuestionsForDependsOn(i) " [value]="dependableQuestion">
                                        {{ dependableQuestion }}
                                      </mat-option>
                                    </mat-select>
                                  </mat-form-field>

                                  <mat-form-field appearance="fill">
                                    <mat-label [attr.for]="'question-dependsOn-{{i}}-{{qdoi}}-value'">Value</mat-label>
                                    <mat-select [id]="'question-dependsOn-{{i}}-{{qdoi}}-value'" [formControlName]="'value'">
                                      <mat-option *ngFor="let option of getValuesForDependsOn(i, getQuestionDependsOnQuestion(i, qi, qdoi).value)" [value]="option.key">
                                        {{ option.value }}
                                      </mat-option>
                                    </mat-select>
                                  </mat-form-field>
                                </div>
                              </div>
                            </mat-card-content>
                          </mat-card>

                          <mat-card formArrayName="options" *ngIf="getSectionsQuestionsOptionable(i, qi)">
                            <mat-card-header>
                              <mat-card-title>Question Options</mat-card-title>
                              <mat-card-subtitle>Options available to select for this question.</mat-card-subtitle>
                            </mat-card-header>

                            <mat-card-content>
                              <div *ngIf="getQuestionOptions(i, qi).controls.length === 0">
                                <em>This question has no options.</em>
                              </div>
        
                              <div *ngFor="let questionOptions of getQuestionOptions(i, qi).controls; let qoi = index">
                                <div [formGroupName]="qoi">
                                  <mat-form-field appearance="fill">
                                    <mat-label [attr.for]="'question-option-{{i}}-{{qi}}-key'">Value</mat-label>
                                    <input matInput [formControlName]="'key'" [id]="'question-option-{{i}}-{{qoi}}-key'" [type]="'text'" />
                                  </mat-form-field>
        
                                  <mat-form-field appearance="fill">
                                    <mat-label [attr.for]="'question-option-{{i}}-{{qi}}-value'">Label</mat-label>
                                    <input matInput [formControlName]="'value'" [id]="'question-option-{{i}}-{{qoi}}-value'" [type]="'text'" />
                                  </mat-form-field>
                                </div>
                              </div>
                            </mat-card-content>
                          </mat-card>
                        </mat-card-content>
                      </mat-card>
                    </mat-expansion-panel>
                  </mat-accordion>
                </mat-card-content>
              </mat-card>
            </mat-expansion-panel>
          </mat-accordion>
        </mat-card-content>
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
  protected getSectionDependsOnList(secIdx: number): FormArray { return (this.getSection(secIdx)).get("dependsOn") as FormArray; }
  protected getSectionDependsOnItem(secIdx: number, dpdsIdx: number): FormGroup { return this.getSectionDependsOnList(secIdx).at(dpdsIdx) as FormGroup; }
  protected getSectionDependsOnSection(secIdx: number, dpdsIdx: number): FormControl { return this.getSectionDependsOnItem(secIdx, dpdsIdx).get("section") as FormControl; }
  protected getSectionDependsOnQuestion(secIdx: number, dpdsIdx: number): FormControl { return this.getSectionDependsOnItem(secIdx, dpdsIdx).get("key") as FormControl; }
  protected getSectionDependsOnValue(secIdx: number, dpdsIdx: number): FormControl { return this.getSectionDependsOnItem(secIdx, dpdsIdx).get("value") as FormControl; }
  
  protected getQuestions(secIdx: number): FormArray { return (this.getSection(secIdx)).get("questions") as FormArray; }
  protected getQuestion(secIdx: number, qIdx: number): FormGroup { return this.getQuestions(secIdx).at(qIdx) as FormGroup }
  protected getQuestionCtrlType(secIdx: number, qIdx: number): FormControl { return (this.getQuestion(secIdx, qIdx).get("controlType") as FormControl); }
  
  protected getQuestionOptions(secIdx: number, qIdx: number): FormArray { return this.getQuestion(secIdx, qIdx).get("options") as FormArray }
  protected getQuestionOption(secIdx: number, qIdx: number, optIdx: number): FormControl { return (this.getQuestion(secIdx, qIdx).get("options") as FormArray).at(optIdx) as FormControl }
  
  protected getQuestionDependsOnList(secIdx: number, qIdx: number): FormArray { return this.getQuestion(secIdx, qIdx).get("dependsOn") as FormArray; }
  protected getQuestionDependsOnItem(secIdx: number, qIdx: number, dpdsIdx: number): FormControl { return this.getQuestionDependsOnList(secIdx, qIdx).at(dpdsIdx) as FormControl; }
  protected getQuestionDependsOnQuestion(secIdx: number, qIdx: number, dpdsIdx: number): FormControl { return this.getQuestionDependsOnItem(secIdx, qIdx, dpdsIdx).get("key") as FormControl; }
  protected getQuestionDependsOnValue(secIdx: number, qIdx: number, dpdsIdx: number): FormControl { return this.getQuestionDependsOnItem(secIdx, qIdx, dpdsIdx).get("value") as FormControl; }

  protected getSectionsForSectionDependsOn(): number[] {
    return Object.keys((this.sections.value as any[])).map(key => +key + 1);
  }

  protected getQuestionsForDependsOn(secIdx: number): string[] {
    return Object.values(this.getQuestions(secIdx).getRawValue()).filter(question => ["radio", "dropdown", "checkbox"].findIndex(ctrlType => ctrlType === question.controlType) > -1).map(question => question.key);
  }

  protected getValuesForDependsOn(secIdx: number, qKey: string): { key: string, value: string }[] {
    const qIdx: number = this.getIndexOfQuestionInSection(secIdx, qKey);
    return this.getQuestionOptions(secIdx, qIdx).value;
  }

  protected getIndexOfQuestionInSection(secIdx: number, qKey: string): number {
    const questions = (this.getQuestions(secIdx).value as DynamicFormQuestion[]);
    return questions.findIndex(question => question.key === qKey);
  }
  
  protected getSectionsQuestionsOptionable(secIdx: number, qIdx: number): boolean {
    return ["radio", "dropdown", "checkbox"].findIndex(ctrlType => ctrlType === this.getQuestionCtrlType(secIdx, qIdx).value) > -1;
  }

  constructor(private dfSvc: DynamicFormService, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.dfSvc.getForm().subscribe(form => {
      this.fg = this.fb.group({
        title: this.fb.control(form.title || ""),
        description: this.fb.control(form.description || ""),
        sections: this.fb.array(form.sections.map(section => {
          return this.fb.group({
            title: this.fb.control(section.title || ""),
            description: this.fb.control(section.description || ""),
            list: this.fb.control(section.list || false),
            required: this.fb.control(section.required || false),
            dependsOn: this.fb.array(section.dependsOn.map(depends => {
              return this.fb.group({
                key: this.fb.control(depends.key || ""),
                section: this.fb.control(depends.section || 0),
                value: this.fb.control(depends.value || ""),
              })
            })),
            questions: this.fb.array(section.questions.map(question => {
              return this.fb.group({
                controlType: this.fb.control(question.controlType || ""),
                dependsOn: this.fb.array(question.dependsOn.map(depends => {
                  return this.fb.group({
                    key: this.fb.control(depends.key || ""),
                    value: this.fb.control(depends.value || ""),
                  });
                })),
                key: this.fb.control(question.key || ""),
                label: this.fb.control(question.label || ""),
                options: this.fb.array(question.options.map(option => {
                  return this.fb.group({
                    key: option.key,
                    value: option.value
                  });
                }) || []),
                required: this.fb.control(question.required || ""),
                type: this.fb.control(question.type || ""),
              })
            }))
          })
        }) || [])
      });
    });
  }

  protected onClickSave(): void {
    this.dfSvc.setForm(this.fg.getRawValue());
    this.snackBar.open("Saved!", "OK");
  }
}
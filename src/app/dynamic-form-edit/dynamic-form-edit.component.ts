import { Component, OnInit } from '@angular/core';
import { DynamicFormService } from '../shared/dynamic-form.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form-edit',
  styles: [
    'mat-card-content { display: flex; flex-direction: column; }', 
    'mat-card { margin-top: 5px; }',
  ],
  template: `
    <form *ngIf="fg" [formGroup]="fg">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Edit form</mat-card-title>
        </mat-card-header>
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
                  <div *ngIf="getSectionsDependsOn(i).controls.length === 0">
                    <em>This section will always be displayed.</em>
                  </div>
  
                  <div *ngFor="let dependsOn of getSectionsDependsOn(i).controls; let doi = index">
                    <div [formGroupName]="doi">
                      <mat-form-field appearance="fill">
                        <mat-label [attr.for]="'dependsOn-{{i}}-{{doi}}-section'">Section index</mat-label>
                        <input matInput [formControlName]="'section'" [id]="'dependsOn-{{i}}-{{doi}}-section'" [type]="'number'" />
                      </mat-form-field>
  
                      <mat-form-field appearance="fill">
                        <mat-label [attr.for]="'dependsOn-{{i}}-{{doi}}-key'">Question</mat-label>
                        <input matInput [formControlName]="'key'" [id]="'dependsOn-{{i}}-{{doi}}-key'" [type]="'text'" />
                      </mat-form-field>
  
                      <mat-form-field appearance="fill">
                        <mat-label [attr.for]="'dependsOn-{{i}}-{{doi}}-value'">Value</mat-label>
                        <input matInput [formControlName]="'value'" [id]="'dependsOn-{{i}}-{{doi}}-value'" [type]="'text'" />
                      </mat-form-field>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card>
                <mat-card-header>
                  <mat-card-title>Section Questions</mat-card-title>
                  <mat-card-subtitle>Questions displayed in this section</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <mat-accordion formArrayName="questions">
                    <mat-expansion-panel *ngFor="let question of getSectionsQuestions(i).controls; let qi = index" [formGroupName]="qi">
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
                              <div *ngIf="getSectionsQuestionsDependsOn(i, qi).controls.length === 0">
                                <em>This question will always be displayed.</em>
                              </div>
        
                              <div *ngFor="let questionDependsOn of getSectionsQuestionsDependsOn(i, qi).controls; let qdoi = index">
                                <div [formGroupName]="qdoi">
                                  <mat-form-field appearance="fill">
                                    <mat-label [attr.for]="'question-dependsOn-{{i}}-{{qi}}-key'">Question</mat-label>
                                    <input matInput [formControlName]="'key'" [id]="'question-dependsOn-{{i}}-{{doi}}-key'" [type]="'text'" />
                                  </mat-form-field>
        
                                  <mat-form-field appearance="fill">
                                    <mat-label [attr.for]="'question-dependsOn-{{i}}-{{qi}}-value'">Value</mat-label>
                                    <input matInput [formControlName]="'value'" [id]="'question-dependsOn-{{i}}-{{doi}}-value'" [type]="'text'" />
                                  </mat-form-field>
                                </div>
                              </div>
                            </mat-card-content>
                          </mat-card>

                          <mat-card formArrayName="options">
                            <mat-card-header>
                              <mat-card-title>Question Options</mat-card-title>
                              <mat-card-subtitle>Options available to select for this question.</mat-card-subtitle>
                            </mat-card-header>

                            <mat-card-content>
                              <div *ngIf="getSectionsQuestionsOptions(i, qi).controls.length === 0">
                                <em>This question has no options.</em>
                              </div>
        
                              <div *ngFor="let questionOptions of getSectionsQuestionsOptions(i, qi).controls; let qoi = index">
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
      <mat-card-header>
        <mat-card-title>Serialized form</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Your form has been serialized to JSON below. The process for saving it is still under construction. Please save it yourself by copy/pasting it into a file.</p>
        <button mat-raised-button *ngIf="fg" [cdkCopyToClipboard]="stringified">Copy to clipboard</button>
        <pre *ngIf="fg"> {{ stringified }} </pre>
      </mat-card-content>
    </mat-card>
  `,
  providers: [ DynamicFormService ]
})
export class DynamicFormEditComponent implements OnInit {
  fg!: FormGroup;
  get stringified(): string { return JSON.stringify(this.fg.getRawValue(), null, 4) };
  get sections(): FormArray { return this.fg.get("sections") as FormArray; }
  getSectionsDependsOn(idx: number): FormArray { return ((this.fg.get("sections") as FormArray).at(idx) as FormGroup).get("dependsOn") as FormArray; }
  getSectionsQuestions(idx: number): FormArray { return ((this.fg.get("sections") as FormArray).at(idx) as FormGroup).get("questions") as FormArray; }
  getSectionsQuestionsDependsOn(idx: number, nextIdx: number): FormArray { return ((((this.fg.get("sections") as FormArray).at(idx) as FormGroup).get("questions") as FormArray).at(nextIdx) as FormGroup).get("dependsOn") as FormArray; }
  getSectionsQuestionsOptions(idx: number, nextIdx: number): FormArray { return ((((this.fg.get("sections") as FormArray).at(idx) as FormGroup).get("questions") as FormArray).at(nextIdx) as FormGroup).get("options") as FormArray; }

  constructor(private dfSvc: DynamicFormService, private fb: FormBuilder) { }

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

      console.log(this.fg);
    });
  }
}
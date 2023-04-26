import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormSection } from '../shared/dynamic-form-section.model';
import { EditSectionKeyDialog } from './edit-section-key.component';
import { DynamicFormEditService } from '../shared/dynamic-form-edit.service';

@Component({
  selector: 'app-dynamic-form-edit-sections',
  template: `<div [formGroup]="fg">
  <mat-accordion formArrayName="sections">
    <mat-expansion-panel *ngFor="let section of s.controls; let i = index" [formGroupName]="i" #secPanel>
      <mat-expansion-panel-header>
        <mat-panel-title>
          Section {{ i+1 }}: {{ dfeSvc.getSectionKey(s, i).getRawValue() }}
        </mat-panel-title>
        <mat-panel-description>
          <button mat-icon-button [color]="secPanel.expanded ? 'primary' : 'none'" matTooltip="list" *ngIf="dfeSvc.getSectionList(s, i).getRawValue()">
            <mat-icon>list_alt</mat-icon>
          </button>
          <button mat-icon-button [color]="secPanel.expanded ? 'primary' : 'none'" matTooltip="not required" *ngIf="!dfeSvc.getSectionRequired(s, i).getRawValue()">
            <mat-icon>flaky</mat-icon>
          </button>
          <button mat-icon-button [color]="secPanel.expanded ? 'primary' : 'none'" matTooltip="questions">
            <mat-icon [matBadge]="dfeSvc.getQuestions(s, i).length" matBadgeColor="accent" matBadgeOverlap="false" matBadgeSize="small">question_answer</mat-icon>
          </button>
          <button mat-icon-button [color]="secPanel.expanded ? 'primary' : 'none'" matTooltip="conditions" *ngIf="dfeSvc.getSectionConditions(s, i).length > 0">
            <mat-icon [matBadge]="dfeSvc.getSectionConditions(s, i).length" matBadgeColor="accent" matBadgeOverlap="false" matBadgeSize="small">rule</mat-icon>
          </button>
        </mat-panel-description>
      </mat-expansion-panel-header>
      <mat-action-row>
        <button mat-icon-button color="warn" matTooltip="delete" (click)="onClickRemoveSection(i)">
          <mat-icon>delete</mat-icon>
        </button>
      </mat-action-row>

      <mat-stepper orientation="horizontal">
        <mat-step label="Section Properties">
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
        
        <mat-step label="Section Questions">
          <app-dynamic-form-edit-questions [fb]="fb" [fg]="fg" [i]="i"></app-dynamic-form-edit-questions>
        </mat-step>

        <mat-step formArrayName="conditions" [label]="dfeSvc.getSectionConditions(s, i).controls.length === 0 ? 'Section Conditions (None)' : 'Section Conditions'">
          <div *ngIf="dfeSvc.getSectionConditions(s, i).controls.length === 0">
            <div>
              <em>There are no conditions under which this section will be displayed, so it will always be displayed by default.</em>
            </div>
            <div>
              <button mat-button color="primary" (click)="onClickAddSectionCondition(i, 0)">
                Add condition
              </button>
            </div>
          </div>
          <div *ngFor="let conditions of dfeSvc.getSectionConditions(s, i).controls; let doi = index">
            <div [formGroupName]="doi">
              <mat-form-field>
                <mat-label attr.for="conditions-{{i}}-{{doi}}-section">Section</mat-label>
                <mat-select id="conditions-{{i}}-{{doi}}-section" formControlName="section">
                  <mat-option *ngFor="let key of dfeSvc.getSectionsForSectionConditions(s)" [value]="key">{{ key }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label attr.for="conditions-{{i}}-{{doi}}-key">Question</mat-label>
                <mat-select id="conditions-{{i}}-{{doi}}-key" formControlName="key">
                  <mat-option *ngFor="let conditionalQuestion of dfeSvc.getQuestionsForConditions(s, dfeSvc.getSectionConditionsSection(s, i, doi).getRawValue())" [value]="conditionalQuestion">
                    {{ conditionalQuestion }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field>
                <mat-label attr.for="conditions-{{i}}-{{doi}}-key">Value</mat-label>
                <mat-select id="conditions-{{i}}-{{doi}}-value" formControlName="value">
                  <mat-option *ngFor="let option of dfeSvc.getValuesForConditions(s, dfeSvc.getSectionConditionsSection(s, i, doi).getRawValue(), dfeSvc.getSectionConditionsQuestion(s, i, doi).getRawValue())" [value]="option.key">
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
  </div>`,
  styles: [
    'mat-panel-description { display: flex; gap: 5px; flex-wrap: wrap; }',
    'footer { position: fixed; bottom: 10px; text-align: center; width: 100%; }',
  ]
})
export class DynamicFormEditSectionsComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;
  get s(): FormArray { return this.fg.get("sections") as FormArray; }

  constructor(protected dfeSvc: DynamicFormEditService, private dialog: MatDialog) { }

  protected onClickEditSectionKey(secIdx: number): void {
    const dialogRef = this.dialog.open(EditSectionKeyDialog, { data: { 
      secIdx: secIdx, 
      secKey: this.dfeSvc.getSectionKey(this.s, secIdx).getRawValue(), 
      invalid: (this.s.getRawValue() as DynamicFormSection[]).map(section => section.key) 
    } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dfeSvc.getSectionKey(this.s, secIdx).patchValue(result);
      }
    });
  }

  protected onClickRemoveSection(secIdx: number): void { this.s.removeAt(secIdx); }

  protected onClickAddSectionCondition(secIdx: number, doIdx: number): void { this.dfeSvc.getSectionConditions(this.s, secIdx).insert(doIdx, this.dfeSvc.sectionConditionsToGroup(this.fb, {key: "", section: "", value: ""})); }
  protected onClickRemoveSectionCondition(secIdx: number, doi: number): void { this.dfeSvc.getSectionConditions(this.s, secIdx).removeAt(doi); }
}

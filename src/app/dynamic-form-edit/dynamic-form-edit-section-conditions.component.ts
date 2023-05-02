import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DynamicFormEditService } from './dynamic-form-edit.service';

@Component({
  selector: 'app-dynamic-form-edit-section-conditions',
  styles: [],
  template: `
  <mat-card [formGroup]="secEdit">
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
          <mat-form-field>
            <mat-label attr.for="conditions-{{doi}}-section">Section</mat-label>
            <mat-select id="conditions-{{doi}}-section" formControlName="section">
              <mat-option *ngFor="let key of dfeSvc.getSectionsForSectionConditions(s)" [value]="key">{{ key }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label attr.for="conditions-{{doi}}-key">Question</mat-label>
            <mat-select id="conditions-{{doi}}-key" formControlName="key">
              <mat-option *ngFor="let conditionalQuestion of dfeSvc.getQuestionsForConditions(s, this.getSectionConditionsSection(doi).getRawValue())" [value]="conditionalQuestion">
                {{ conditionalQuestion }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field>
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
  </mat-card>`
})
export class DynamicFormEditSectionConditionsComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;
  @Input() secEdit!: FormGroup;

  protected get s(): FormArray { return this.fg.get("sections") as FormArray; }
  protected get secEditConditions(): FormArray { return this.secEdit.get("conditions") as FormArray; }

  constructor(protected dfeSvc: DynamicFormEditService) { }

  protected getSectionConditionsSection(dpdsIdx: number): FormControl { return this.secEditConditions.at(dpdsIdx).get("section") as FormControl; }
  protected getSectionConditionsQuestion(dpdsIdx: number): FormControl { return this.secEditConditions.at(dpdsIdx).get("key") as FormControl; }

  protected onClickAddSectionCondition(doIdx: number): void { this.secEditConditions.insert(doIdx, this.dfeSvc.sectionConditionsToGroup(this.fb, {key: "", section: "", value: ""})); }
  protected onClickRemoveSectionCondition(doi: number): void { this.secEditConditions.removeAt(doi); }
}

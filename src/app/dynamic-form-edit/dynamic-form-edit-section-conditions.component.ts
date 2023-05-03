import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DynamicFormEditService } from './dynamic-form-edit.service';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormSectionCondition } from '../shared/dynamic-form-section-condition.model';
import { DeleteConfirmDialog } from './delete-confirm.dialog';

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
      </div>
      <div *ngFor="let conditions of secEditConditions.controls; let cndIdx = index" formArrayName="conditions">
        <div [formGroupName]="cndIdx">
          <mat-form-field>
            <mat-label attr.for="conditions-{{cndIdx}}-section">Section</mat-label>
            <mat-select id="conditions-{{cndIdx}}-section" formControlName="section">
              <mat-option *ngFor="let key of dfeSvc.getSectionsForSectionConditions(s)" [value]="key">{{ key }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label attr.for="conditions-{{cndIdx}}-key">Question</mat-label>
            <mat-select id="conditions-{{cndIdx}}-key" formControlName="key">
              <mat-option *ngFor="let conditionalQuestion of dfeSvc.getQuestionsForConditions(s, this.getSectionConditionsSection(cndIdx).getRawValue())" [value]="conditionalQuestion">
                {{ conditionalQuestion }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label attr.for="conditions-{{cndIdx}}-key">Value</mat-label>
            <mat-select id="conditions-{{cndIdx}}-value" formControlName="value">
              <mat-option *ngFor="let option of dfeSvc.getValuesForConditions(s, this.getSectionConditionsSection(cndIdx).getRawValue(), this.getSectionConditionsQuestion(cndIdx).getRawValue())" [value]="option.key">
                {{ option.value }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <button type="button" mat-icon-button color="warn" (click)="onClickRemoveSectionCondition(cndIdx)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
    </mat-card-content>
    <mat-card-actions>
      <button type="button" (click)="onClickAddSectionCondition()" mat-button color="primary">
        Add condition
      </button>
    </mat-card-actions>
  </mat-card>`
})
export class DynamicFormEditSectionConditionsComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;
  @Input() secEdit!: FormGroup;

  protected get s(): FormArray { return this.fg.get("sections") as FormArray; }
  protected get secEditConditions(): FormArray { return this.secEdit.get("conditions") as FormArray; }

  constructor(protected dfeSvc: DynamicFormEditService, private dialog: MatDialog) { }

  protected getSectionConditionsSection(cndIdx: number): FormControl { return this.secEditConditions.at(cndIdx).get("section") as FormControl; }
  protected getSectionConditionsQuestion(cndIdx: number): FormControl { return this.secEditConditions.at(cndIdx).get("key") as FormControl; }

  protected onClickAddSectionCondition(): void { this.secEditConditions.push(this.dfeSvc.sectionConditionsToGroup(this.fb, new DynamicFormSectionCondition())); }
  protected onClickRemoveSectionCondition(cndIdx: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, { data: { 
      key: `Condition on ${this.getSectionConditionsSection(cndIdx).getRawValue()}'s ${this.getSectionConditionsQuestion(cndIdx).getRawValue()}`
    } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.secEditConditions.removeAt(cndIdx);
      }
    });
  }
}

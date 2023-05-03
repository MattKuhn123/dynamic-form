import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormSection } from '../shared/dynamic-form-section.model';
import { EditSectionKeyDialog } from './edit-section-key.dialog';
import { DynamicFormEditService } from './dynamic-form-edit.service';

@Component({
  selector: 'app-dynamic-form-edit-section',
  styles: [],
  template: `
  <mat-card [formGroup]="secEdit">
    <mat-card-content>
      <div>
        <mat-form-field>
          <mat-label for="section-key">Key</mat-label>
          <input matInput formControlName="key" id="section-key" type="text"/>
          <mat-icon matSuffix color="primary" matTooltip="edit" (click)="onClickEditSectionKey()">edit</mat-icon>
        </mat-form-field>
      </div>
      <div>
        <mat-form-field>
          <mat-label for="section-subtitle">Subtitle</mat-label>
          <textarea matInput formControlName="subtitle" id="section-subtitle" type="text"></textarea>
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
      <div *ngIf="secEditList.getRawValue()">
        <mat-label for="section-require-at-least-one">
          <mat-checkbox formControlName="requireAtLeastOne" id="section-require-at-least-one"></mat-checkbox>
          Require at least one
        </mat-label>
      </div>
      <div>
        <mat-label for="section-info">
          Additional information
        </mat-label>
        <ckeditor id="section-info" formControlName="info" data=""></ckeditor>
      </div>
    </mat-card-content>
  </mat-card>

  <app-dynamic-form-edit-questions 
    [fb]="fb"
    [fg]="fg" 
    [secEdit]="secEdit"
    [secEditIdx]="secEditIdx"
    (raiseClickEditQuestion)=" raiseClickEditQuestion.emit($event)"
  ></app-dynamic-form-edit-questions>

  <app-dynamic-form-edit-section-conditions
    [fb]="fb" 
    [fg]="fg" 
    [secEdit]="secEdit"
  ></app-dynamic-form-edit-section-conditions>
  `,
})
export class DynamicFormEditSectionComponent {
  @Input() fg!: FormGroup;
  @Input() fb!: FormBuilder;
  @Input() secEditIdx!: number;
  
  @Output() raiseClickEditQuestion: EventEmitter<number> = new EventEmitter<number>();
  
  protected get s(): FormArray { return this.fg.get("sections") as FormArray; }
  protected get secEdit(): FormGroup { return this.dfeSvc.getSection(this.s, this.secEditIdx) as FormGroup; }
  protected get secEditConditions(): FormArray { return this.secEdit.get("conditions") as FormArray; }
  protected get secEditKey(): FormControl { return this.secEdit.get("key") as FormControl; }
  protected get secEditList(): FormControl { return this.secEdit.get("list") as FormControl; }
  protected get secEditInfo(): FormControl { return this.secEdit.get("info") as FormControl; }

  constructor(protected dfeSvc: DynamicFormEditService, private dialog: MatDialog) { }

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
}

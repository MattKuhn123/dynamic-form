import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormQuestion } from '../shared/dynamic-form-question.model';
import { DynamicFormEntryStorageService } from './dynamic-form-entry-storage.service';

@Component({
  selector: 'app-dynamic-question',
  template: `
  <div *ngIf="!hidden" [formGroup]="form">
    <div *ngIf="question.info" [innerHtml]="question.info"></div>
    <div [ngSwitch]="question.controlType">
      <div *ngSwitchCase="'textarea'">
        <mat-form-field>
          <mat-label [attr.for]="question.key" *ngIf="question.label">{{ question.label }}</mat-label>
          <textarea matInput [formControlName]="question.key" [id]="question.key"></textarea>
        </mat-form-field>
      </div>

      <div *ngSwitchCase="'checkbox'">
        <mat-slide-toggle [formControlName]="question.key" [id]="question.key"></mat-slide-toggle>
        <mat-label [attr.for]="question.key" *ngIf="question.label">
          {{ question.label }}
        </mat-label>
      </div>

      <div *ngSwitchCase="'textbox'">
        <mat-form-field>
          <mat-label [attr.for]="question.key" *ngIf="question.label">{{ question.label }}</mat-label>
          <input matInput [formControlName]="question.key" [id]="question.key" type="text" />
        </mat-form-field>
      </div>

      <div *ngSwitchCase="'dropdown'">
        <mat-form-field>
          <mat-label [attr.for]="question.key" *ngIf="question.label">{{ question.label }}</mat-label>
          <mat-select [id]="question.key" [formControlName]="question.key">
            <mat-option *ngFor="let opt of question.options" [value]="opt.key"> {{ opt.value }} </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div *ngSwitchCase="'radio'">
        <mat-label [attr.for]="question.key" *ngIf="question.label">{{ question.label }}</mat-label><br />
        <mat-radio-group [id]="question.key" [formControlName]="question.key" style="display: flex; flex-direction: column;">
          <mat-radio-button *ngFor="let opt of question.options" [value]="opt.key"> {{ opt.value }} </mat-radio-button>
        </mat-radio-group>
      </div>

      <div *ngSwitchCase="'date'">
        <mat-form-field>
          <mat-label>{{ question.label }}</mat-label>
          <input *ngIf="question.temporal === 'past'" [max]="today" [id]="question.key" [formControlName]="question.key" matInput [matDatepicker]="picker">
          <input *ngIf="question.temporal === 'future'" [min]="today" [id]="question.key" [formControlName]="question.key" matInput [matDatepicker]="picker">
          <input *ngIf="question.temporal === ''" [id]="question.key" [formControlName]="question.key" matInput [matDatepicker]="picker">
          <mat-hint>MM/DD/YYYY</mat-hint>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </div>

      <div *ngSwitchCase="'file'">
        <button type="button" mat-button (click)="fileInput.click()">{{ question.label }}</button>
        <input [formControlName]="question.key" hidden (change)="onFileSelected(question.key)" #fileInput type="file" [id]="question.key">
        <p *ngIf="fileName">{{ fileName }}</p>
      </div>
    </div>
  </div>
  `
})
export class DynamicFormEntryQuestionComponent {
  @Input() question!: DynamicFormQuestion;
  @Input() form!: FormGroup;

  constructor(private entryStorage: DynamicFormEntryStorageService) { }

  get isValid(): boolean { return this.form.controls[this.question.key].valid; }
  get hidden(): boolean { return this.question.conditions.findIndex(question => `${this.form.controls[question.key].value}` !== question.value) > -1; }
  get today(): Date { return new Date(); }

  protected fileName: string = "";

  protected onFileSelected(id: string): void {
    const inputNode: any = document.querySelector(`#${id}`);
    this.fileName = inputNode.files[0].name;
    if (typeof(FileReader) === 'undefined') {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      console.log(e.target.result);
    };

    reader.onprogress = (p: any) => {
      console.log(p);
    };

    reader.readAsArrayBuffer(inputNode.files[0]);
  }
}
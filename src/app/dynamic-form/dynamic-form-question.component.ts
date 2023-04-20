import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormQuestion } from './dynamic-form-question.model';

@Component({
  selector: 'app-dynamic-question',
  template: `
    <div *ngIf="!hidden" [formGroup]="form">
      <div [ngSwitch]="question.controlType">

        <div *ngSwitchCase="'textarea'">
          <mat-form-field appearance="fill">
            <mat-label [attr.for]="question.key">{{ question.label }}</mat-label>
            <textarea matInput [formControlName]="question.key" [id]="question.key" matInput></textarea>
          </mat-form-field>
        </div>

        <div *ngSwitchCase="'textbox'">
          <mat-form-field appearance="fill">
            <mat-label [attr.for]="question.key">{{ question.label }}</mat-label>
            <input matInput [formControlName]="question.key" [id]="question.key" [type]="question.type" />
          </mat-form-field>
        </div>

        <div *ngSwitchCase="'dropdown'">
          <mat-form-field appearance="fill">
            <mat-label [attr.for]="question.key">{{ question.label }}</mat-label>
            <mat-select [id]="question.key" [formControlName]="question.key">
              <mat-option *ngFor="let opt of question.options" [value]="opt.key"> {{ opt.value }} </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div *ngSwitchCase="'checkbox'">
          <mat-label [attr.for]="question.key">{{ question.label }}
            <mat-checkbox [formControlName]="question.key" [id]="question.key"></mat-checkbox>
          </mat-label>
        </div>

        <div *ngSwitchCase="'radio'">
          <mat-label [attr.for]="question.key">{{ question.label }}</mat-label><br />
          <mat-radio-group [id]="question.key">
            <mat-radio-button *ngFor="let opt of question.options" [value]="opt.key"> {{ opt.value }} </mat-radio-button>
          </mat-radio-group>
        </div>

        <div *ngSwitchCase="'date'">
          <mat-form-field appearance="fill">
            <mat-label>{{ question.label }}</mat-label>
            <input [id]="question.key" [formControlName]="question.key" matInput [matDatepicker]="picker">
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
export class DynamicFormQuestionComponent {
  @Input() question!: DynamicFormQuestion;
  @Input() form!: FormGroup;
  get isValid(): boolean { return this.form.controls[this.question.key].valid; }
  get hidden(): boolean { return this.question.dependsOn.findIndex(question => this.form.controls[question.key].value !== question.value) > -1; }

  protected fileName: string = "";

  protected onFileSelected(id: string): void {
    const inputNode: any = document.querySelector(`#${id}`);
    if (typeof (FileReader) === 'undefined') {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => { console.log(e.target.result); };
    reader.readAsArrayBuffer(inputNode.files[0]);
    this.fileName = inputNode.files[0].name;
  }
}
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
          <mat-label [attr.for]="question.key">{{ question.label }}</mat-label><br />
          <mat-checkbox [formControlName]="question.key" [id]="question.key"></mat-checkbox>
        </div>

        <div *ngSwitchCase="'radio'">
          <mat-label [attr.for]="question.key">{{ question.label }}</mat-label><br />
          <mat-radio-group [id]="question.key">
            <mat-radio-button *ngFor="let opt of question.options" [value]="opt.key"> {{ opt.value }} </mat-radio-button>
          </mat-radio-group>
        </div>
      </div>

      <!-- <mat-error *ngIf="!isValid">{{ question.label }} is required</mat-error> -->
    </div>
  `
})
export class DynamicFormQuestionComponent {
  @Input() question!: DynamicFormQuestion<string>;
  @Input() form!: FormGroup;
  get isValid(): boolean { return this.form.controls[this.question.key].valid; }
  get hidden(): boolean { return this.question.dependsOn.findIndex(question => this.form.controls[question.key].value !== question.value) > -1; }
}
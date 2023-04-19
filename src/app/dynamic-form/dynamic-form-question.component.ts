import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormQuestion } from './dynamic-form-question.model';

@Component({
  selector: 'app-dynamic-question',
  template: `
    <div *ngIf="!hidden" [formGroup]="form">
      <mat-form-field appearance="fill">
        <mat-label [attr.for]="question.key">{{ question.label }}</mat-label>
        <div [ngSwitch]="question.controlType">
          <input matInput *ngSwitchCase="'textbox'" [formControlName]="question.key" [id]="question.key" [type]="question.type" />
          <mat-select *ngSwitchCase="'dropdown'" [id]="question.key" [formControlName]="question.key">
            <mat-option *ngFor="let opt of question.options" [value]="opt.key"> {{ opt.value }} </mat-option>
          </mat-select>
        </div>
      </mat-form-field>
      <div class="errorMessage" *ngIf="!isValid">
        {{ question.label }} is required
      </div>
    </div>
  `
})
export class DynamicFormQuestionComponent {
  @Input() question!: DynamicFormQuestion<string>;
  @Input() form!: FormGroup;
  get isValid(): boolean { return this.form.controls[this.question.key].valid; }
  get hidden(): boolean { return this.question.dependsOn.findIndex(question => this.form.controls[question.key].value !== question.value) > -1; }
}
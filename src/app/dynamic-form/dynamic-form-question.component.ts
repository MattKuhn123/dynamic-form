import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormQuestion } from './dynamic-form-question.model';

@Component({
  selector: 'app-dynamic-question',
  template: `
    <div *ngIf="!hidden" [formGroup]="form">
      <label [attr.for]="question.key">{{ question.label }}</label>
      <div [ngSwitch]="question.controlType">
        <input *ngSwitchCase="'textbox'" [formControlName]="question.key" [id]="question.key" [type]="question.type" />
        <select *ngSwitchCase="'dropdown'" [id]="question.key" [formControlName]="question.key">
          <option *ngFor="let opt of question.options" [value]="opt.key"> {{ opt.value }} </option>
        </select>
      </div>
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
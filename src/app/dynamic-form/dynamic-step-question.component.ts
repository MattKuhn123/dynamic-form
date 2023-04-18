import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from './question-base.model';

@Component({
  selector: 'app-question',
  template: `
  <div *ngIf="!hidden" [formGroup]="form">
    <label [attr.for]="question.key">{{ question.label }}</label>
    <div [ngSwitch]="question.controlType">
      <input *ngSwitchCase="'textbox'" [formControlName]="question.key" [id]="question.key" [type]="question.type" />
      <select [id]="question.key" *ngSwitchCase="'dropdown'" [formControlName]="question.key">
        <option *ngFor="let opt of question.options" [value]="opt.key"> {{ opt.value }} </option>
      </select>
    </div>
    <div class="errorMessage" *ngIf="!isValid">
      {{ question.label }} is required
    </div>
  </div>
  `
})
export class DynamicStepQuestionComponent {
  @Input() question!: QuestionBase<string>;
  @Input() form!: FormGroup;
  get isValid(): boolean { return this.form.controls[this.question.key].valid; }
  get hidden(): boolean { return this.question.dependsOn.findIndex(question => this.form.controls[question.key].value !== question.value) > -1; }
}
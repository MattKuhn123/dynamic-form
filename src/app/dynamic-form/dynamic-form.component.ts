import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from './question-base.model';
import { QuestionControlService } from './question-control.service';

@Component({
  selector: 'app-dynamic-form',
  providers: [ QuestionControlService ],
  template: `
  <div>
    <form (ngSubmit)="onSubmit()" [formGroup]="form">
      <div *ngFor="let question of questions" class="form-row">
        <app-question [question]="question" [form]="form"></app-question>
      </div>

      <div class="form-row">
        <button type="submit" [disabled]="!form.valid">Save</button>
      </div>
    </form>

    <div *ngIf="payLoad" class="form-row">
      <strong>Saved the following values</strong><br />{{ payLoad }}
    </div>
  </div>
  `,
})
export class DynamicFormComponent implements OnInit {
  @Input() questions: QuestionBase<any>[] = [];

  form!: FormGroup;
  payLoad = '';

  constructor(private qcs: QuestionControlService) {}

  ngOnInit(): void {
    this.form = this.qcs.toFormGroup(this.questions as QuestionBase<any>[]);
  }

  protected onSubmit(): void {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }
}

import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DynamicStepQuestion } from './dynamic-step-question.model';

@Injectable()
export class QuestionControlService {
  toFormGroup(questions: DynamicStepQuestion<any>[]): FormGroup {
    const group: any = {};

    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || '');
    });
    
    return new FormGroup(group);
  }
}

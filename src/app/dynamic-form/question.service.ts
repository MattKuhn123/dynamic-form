import { Injectable } from '@angular/core';
import { QuestionBase } from './question-base';
import { Observable, of } from 'rxjs';

@Injectable()
export class QuestionService {

  // TODO: get from a remote source of question metadata
  public getQuestions(): Observable<QuestionBase<string>[]> {

    const questions: QuestionBase<string>[] = [

      new QuestionBase<string>({
        key: 'brave',
        label: 'Bravery Rating',
        options: [
          {key: 'solid',  value: 'Solid'},
          {key: 'great',  value: 'Great'},
          {key: 'good',   value: 'Good'},
          {key: 'unproven', value: 'Unproven'}
        ],
        order: 3,
        controlType: "dropdown"
      }),

      new QuestionBase<string>({
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 1,
        controlType: "textbox"
      }),

      new QuestionBase<string>({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 2,
        controlType:"textbox"
      })
    ];

    return of(questions.sort((a, b) => a.order - b.order));
  }
}

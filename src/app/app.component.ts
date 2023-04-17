import { Component } from '@angular/core';

import { QuestionService } from './dynamic-form/question.service';
import { QuestionBase } from './dynamic-form/question-base';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h2>Job Application for Heroes</h2>
      <div *ngIf="questions.length > 0">
        <app-dynamic-form [questions]="questions"></app-dynamic-form>
      </div>
    </div>
  `,
  providers: [ QuestionService ]
})
export class AppComponent {
  questions: QuestionBase<any>[] = [];

  constructor(qs: QuestionService) {
    qs.getQuestions().subscribe(questions =>  this.questions = questions);
  }
}

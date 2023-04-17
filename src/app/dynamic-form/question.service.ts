import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionBase } from './question-base';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class QuestionService {

  constructor(private client: HttpClient) {}

  public getQuestions(): Observable<QuestionBase<string>[]> {
    return this.client.get(`${environment.api}${environment.questions}`)
      .pipe(
        map((data: any) => data.questions as QuestionBase<string>[]),
        map((data: QuestionBase<any>[]) => data.sort((a: QuestionBase<string>, b: QuestionBase<string>) => a.order - b.order)),
      );
  }
}

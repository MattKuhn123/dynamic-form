import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionBase } from './question-base.model';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class QuestionService {

  constructor(private client: HttpClient) {}

  public getQuestions(): Observable<QuestionBase<any>[]> {
    return this.client.get(`${environment.api}${environment.questions}`)
      .pipe(
        map((data: any) => data.questions as QuestionBase<any>[]),
        map((data: QuestionBase<any>[]) => data.sort((a: QuestionBase<any>, b: QuestionBase<any>) => a.order - b.order)),
      );
  }
}

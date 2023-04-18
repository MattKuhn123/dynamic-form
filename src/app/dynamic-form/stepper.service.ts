import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DynamicStep } from './dynamic-step.model';
import { DynamicStepQuestion } from './dynamic-step-question.model';

@Injectable()
export class StepperService {
  constructor(private client: HttpClient) { }

  public getSteps(): Observable<DynamicStep[]> {
    return this.client.get(`${environment.api}${environment.steps}`)
      .pipe(
        map((data: any) => data.steps as DynamicStep[]),
        map((steps: DynamicStep[]) => steps.sort((a: DynamicStep, b: DynamicStep) => a.order - b.order)),
        map((steps: DynamicStep[]) => {
            steps.forEach(step => step.questions.sort((a: DynamicStepQuestion<any>, b: DynamicStepQuestion<any>) => a.order - b.order));
            return steps;
          }),
        );
  }
}

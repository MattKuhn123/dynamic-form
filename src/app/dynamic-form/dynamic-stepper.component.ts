import { Component } from '@angular/core';

import { StepperService } from './stepper.service';
import { DynamicStep } from './dynamic-step.model';

@Component({
  selector: 'app-dynamic-stepper',
  template: `
    <div>
      <div *ngFor="let step of steps">
        <h2> {{step.title }} </h2>
        <p> {{step.description }} </p>
        <div *ngIf="step.questions.length > 0">
          <app-dynamic-step [questions]="step.questions"></app-dynamic-step>
        </div>
      </div>
    </div>
  `,
  providers: [ StepperService ]
})
export class DynamicStepperComponent {
  steps: DynamicStep[] = [];

  constructor(qs: StepperService) {
    qs.getSteps().subscribe(steps =>  this.steps = steps);
  }
}

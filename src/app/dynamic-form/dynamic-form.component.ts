import { Component, OnInit } from '@angular/core';

import { DynamicFormService } from './dynamic-form.service';
import { DynamicFormSection } from './dynamic-form-section.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicFormQuestion } from './dynamic-form-question.model';

@Component({
  selector: 'app-dynamic-form',
  template: `
  <div *ngIf="sections">
    <form (ngSubmit)="onSubmit()" [formGroup]="formGroup">
      <mat-stepper formArrayName="formArray">
        <div *ngFor="let section of sections; let i = index">
          <mat-step *ngIf="!hidden(section)" formGroupName="{{ i }}" [stepControl]="getFormGroupInArray(i)">
            <div *ngFor="let question of section.questions" class="form-row">
              <app-dynamic-question [question]="question" [form]="getFormGroupInArray(i)"></app-dynamic-question>
            </div>
          </mat-step>
        </div>
      </mat-stepper>
    </form>
  </div>
  `,
  providers: [ DynamicFormService ]
})
export class DynamicFormComponent implements OnInit {
  formArray!: FormArray;
  formGroup!: FormGroup;
  sections!: DynamicFormSection[];

  constructor(private dynamicFormService: DynamicFormService, private formBuilder: FormBuilder) { }
  
  ngOnInit(): void {
    this.dynamicFormService.getForms().subscribe(forms => {
      const form = forms[0];
      this.sections = form.sections;
      this.formGroup = this.formBuilder.group({
        formArray: this.formBuilder.array(form.sections.map(step => this.toFormGroup(step.questions)))
      });
      
      this.formArray = this.formGroup.get('formArray') as FormArray;
    });
  }

  protected getFormGroupInArray(index: number): FormGroup {
    return this.formArray.at(index) as FormGroup;
  }

  protected hidden(section: DynamicFormSection): boolean {
    if (section.dependsOn.length === 0) {
      return false;
    }

    return section.dependsOn.findIndex(depends => this.getFormGroupInArray(depends.step).controls[depends.key].value === depends.value) <= -1;
  }

  protected onSubmit(): boolean {
    // TODO
    return true;
  }

  private toFormGroup(questions: DynamicFormQuestion<any>[]): FormGroup {
    const group: any = {};
    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required) : new FormControl(question.value || '');
    });
    
    return new FormGroup(group);
  }
}

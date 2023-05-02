import { ValidatorFn, AbstractControl, ValidationErrors, FormArray } from "@angular/forms";

export const questionMinimum: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const questions = control.get('questions') as FormArray;

  return questions?.length === 0 ? { questionsRequired: true } : null;
};
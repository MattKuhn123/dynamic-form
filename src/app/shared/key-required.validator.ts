import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export const keyRequiredValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const key = control.get('key');

  return !key?.value ? { keyRequired: true } : null;
};
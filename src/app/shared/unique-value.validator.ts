import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function uniqueValidator(invalidValues: string[]): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {

      const value = control.value;

      if (!value) {
          return null;
      }

      const isUnique = invalidValues.findIndex(section => section === value) < 0;

      const isValid = isUnique;

      return !isValid ? { unique: true }: null;
  }
}
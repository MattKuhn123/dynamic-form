import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function uniqueValidator(invalidValues: string[]): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {

      const value: string = control.value;

      if (!value) {
          return null;
      }

      const isUnique = invalidValues.findIndex(invalidValue => invalidValue.toLowerCase() === value.toLowerCase()) < 0;

      const isValid = isUnique;

      return !isValid ? { unique: true }: null;
  }
}
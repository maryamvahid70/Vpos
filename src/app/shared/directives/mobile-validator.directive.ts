import { Directive, forwardRef, Input } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[mobileValidator][ngModel],[mobileValidator][formControlName]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MobileValidatorDirective),
      multi: true
    }
  ]
})
export class MobileValidatorDirective implements Validator {
  @Input() mobileValidator: boolean = true;

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.mobileValidator) {
      return null
    }
    const rawValue = control.value;
    // Allow empty values (e.g. required validator will handle this separately)
    if (!rawValue || rawValue.trim() === '') {
      return null;
    }
    const value = control.value?.replace(/[-\s]/g, '');
    const isValid = /^09\d{9}$/.test(value);
    return isValid ? null : { mobileInvalid: true };
  }
}

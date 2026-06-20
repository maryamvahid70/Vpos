import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[emailValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EmailValidatorDirective,
      multi: true,
    },
  ],
})
export class EmailValidatorDirective implements Validator {
  @Input() emailValidator: boolean = false;
  validate(control: AbstractControl): ValidationErrors | null {
    if(!this.emailValidator) return null
    const value = control.value?.trim();
    if (!value) return null; // Allow empty input (use required separately)
    const emailRegex =
       /^[a-zA-Z0-9._%+-]{2,}@[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? null : { emailInvalid: true };
  }
}

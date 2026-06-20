import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
} from '@angular/forms';

@Directive({
  selector: '[passwordValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordValidatorDirective implements Validator {
  @Input() appPasswordStrengthValidator: any; // می‌توانید از این برای پاس دادن تنظیمات استفاده کنید، اگرچه فعلاً لازم نیست.
  @Input() passwordValidator: boolean = true;
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null; // If the value is empty, the 'required' validator should handle it.
    }

    let errors: ValidationErrors = {};
    let isValid = true;

    // 1. Must contain at least one lowercase English letter
    const hasLowerCase = /[a-z]+/.test(value);
    if (!hasLowerCase) {
      errors['hasLowerCase'] = true;
      isValid = false;
    }

    // 2. Must contain at least one uppercase English letter
    const hasUpperCase = /[A-Z]+/.test(value);
    if (!hasUpperCase) {
      errors['hasUpperCase'] = true;
      isValid = false;
    }

    // 3. Must contain at least one digit
    const hasDigit = /[0-9]+/.test(value);
    if (!hasDigit) {
      errors['hasDigit'] = true;
      isValid = false;
    }

    // 4. Must contain at least one special character (!@#$%^&* etc.)
    // Note: You can customize this regex to include/exclude specific special characters.
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    if (!hasSpecialChar) {
      errors['hasSpecialChar'] = true;
      isValid = false;
    }

    // 5. Must be at least 8 characters long
    const isMinLength = value.length >= 8;
    if (!isMinLength) {
      errors['minlength'] = { requiredLength: 8, actualLength: value.length }; // Similar to built-in minlength error
      isValid = false;
    }

    // If isValid is still true, it means no errors were found.
    return isValid ? null : errors;
  }
}

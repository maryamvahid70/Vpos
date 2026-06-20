import { Directive, forwardRef, HostListener, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[ipv4Validator][ngModel],[ipv4Validator][formControlName]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => Ipv4ValidatorDirective),
    multi: true
  }]
})
export class Ipv4ValidatorDirective implements Validator {

  @Input() ipv4Validator: boolean = true;

  @HostListener('keypress', ['$event'])
  onKeyPress(e: KeyboardEvent) {
    if (!this.ipv4Validator) return;
    const allowed = /[0-9.]/;
    if (!allowed.test(e.key)) {
      e.preventDefault();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.ipv4Validator) return null;

    const value = (control.value || '').trim();
    if (!value) return null;

    const parts = value.split('.');
    if (parts.length !== 4) return { ipv4Invalid: true };

    for (const part of parts) {
      if (!/^\d{1,3}$/.test(part)) return { ipv4Invalid: true };

      const num = Number(part);
      if (num < 0 || num > 255) return { ipv4Invalid: true };

      if (part.length > 1 && part.startsWith('0')) return { ipv4Invalid: true };
    }

    return null;
  }
}

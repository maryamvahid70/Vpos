import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
    selector: '[numberRequired], app-text-input[numberRequired]', // 👈 اضافه کردن app-text-input
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: NumberRequiredDirective,
            multi: true,
        },
    ],
    standalone: false
})
export class NumberRequiredDirective implements Validator {
    validate(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        // اگر مقدار خالی یا null بود → required فعال شود
        if (value === '' || value === null || value === undefined) {
            return { required: true };
        }
        return null;
    }
}

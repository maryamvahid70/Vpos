import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[persianLettersOnly]'
})
export class PersianLettersOnlyDirective {
  @Input() persianLettersOnly: boolean = true;
  constructor(private control: NgControl) { }
  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    if(!this.persianLettersOnly) return
    const input = event.target as HTMLInputElement;

    // Regex to allow only Persian letters and spaces
    const persianRegex = /^[\u0600-\u06FF\s]+$/;

    // Filter the input value
    const filteredValue = input.value.split('').filter(char => persianRegex.test(char)).join('');

    // Update the form control value
    this.control.control?.setValue(filteredValue);
  }

}

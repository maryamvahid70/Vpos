import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumberSeparator]',
  standalone: false
})
export class NumberSeparatorDirective {

  @Input() appNumberSeparator: boolean = true;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    if (!this.appNumberSeparator) return;

    const input = this.el.nativeElement;

    // حذف همه کاماها
    let raw = input.value.replace(/,/g, '');

    if (!raw) {
      input.value = '';
      return;
    }

    // حذف هر چیزی که عدد نیست
    raw = raw.replace(/\D/g, '');

    // اعمال فرمت سه‌رقمی
    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    input.value = formatted;
  }
}

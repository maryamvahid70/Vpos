import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[ClickOutside]'
})
export class ClickOutsideDirective {
  @Input() excludeElement?: HTMLElement;
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(target: EventTarget | null): void {
    if (!(target instanceof HTMLElement)) return;

    const clickedInside = this.elementRef.nativeElement.contains(target);
    const clickedOnExclude = this.excludeElement?.contains(target);

    if (!clickedInside && !clickedOnExclude) {
      this.clickOutside.emit();
    }
  }
}

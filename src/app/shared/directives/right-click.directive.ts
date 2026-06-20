import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appRightClick]'
})
export class RightClickDirective {
  @Output() rightClick = new EventEmitter<MouseEvent>();
  constructor() { }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    this.rightClick.emit(event);
  }
}

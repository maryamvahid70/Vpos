import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
let uniqueIdCounter = 0;
@Component({
  selector: 'app-switcher',
  standalone:false,
  templateUrl: './switcher.component.html',
  styleUrl: './switcher.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitcherComponent),
      multi: true,
    },
  ],
})
export class SwitcherComponent {
  value: any;
  inputId: string = '';
  @Input() type: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' = 'primary';
  @Input() isDisabled: boolean = false;
  constructor() {
    this.inputId = `textInput-${uniqueIdCounter++}`;
  }
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  handleInputChange(val: any) {
    this.value = val;       // update internal value
    this.onChange(val);     // notify Angular form
  }
}

import { Component, forwardRef, HostListener, Input } from '@angular/core';
import { AppSetting } from '../../../core/resources/app-setting';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
let uniqueIdCounter = 0;

@Component({
  selector: 'app-jalali-date-picker',
  standalone: false,
  templateUrl: './jalali-date-picker.component.html',
  styleUrl: './jalali-date-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JalaliDatePickerComponent),
      multi: true,
    },
  ],
})
export class JalaliDatePickerComponent {
  @Input() submitted: boolean = false;
  @Input() animatedLabel: boolean = true;
  @Input() isRequired: boolean = true;
  @Input() label: string = 'تاریخ تولد'
  setting: AppSetting = new AppSetting();
  value: FormControl = new FormControl();
  inputID: string = '';
  dateMask = [/[1]/, /[3-4]/, /[0-9]/, /[0-9]/, '/', /[0-1]/, /[0-9]/, '/', /[0-3]/, /[0-9]/];
  datePattern = '^1[3-4][0-9]{2}/[0-1][0-9]/[0-3][0-9]$';
  constructor() {
    this.inputID = `dateInput-${uniqueIdCounter++}`;
  }
  onChange = (value: any) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    if (value) {

      this.value.setValue(value);
    }
    else {
      this.value.setValue('');
    }
  }

  registerOnChange(fn: any): void {
    // this.onChange = fn;
    this.value.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void { }

  //Hiding datePicker after tab key pressed
  datepickerVisible: boolean = false;
  onUiIsVisibleChange(visible: boolean): void {
    this.datepickerVisible = visible;
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      this.datepickerVisible = false;
    }
  }

}

import { ChangeDetectorRef, Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppSetting } from '../../../core/resources/app-setting';
import { MaskitoOptions } from "@maskito/core";

let uniqueIdCounter = 0;
@Component({
  selector: 'app-text-input',
  standalone: false,
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
})
export class TextInputComponent implements ControlValueAccessor {
  setting: AppSetting = new AppSetting();
  @Input() iconName: string = '';
  @Input() label: string = '';
  @Input() animatedLabel: boolean = true;
  @Input() placeholder?: string = '';
  @Input() persianLettersOnly: boolean = true;
  @Input() submitted: boolean = false;
  @Input() maskType: 'cellphone' | 'email' | 'none' | 'password' | 'IP' | 'number' = 'none';
  @Input() isRequired: boolean = true;
  @Input() showPasswordStrengthMessages: boolean = false;
  @Input() ltrDirection: boolean = false;
  // permission
  @Input() readonly: boolean = false;
  @Input() isCaptcha: boolean = false;
  @Input() inputClass: string = '';
  @Input() maxlength: number | null = null;
  @Input() numberSeparator = false;
  
  @ViewChild('inputRef') inputElement!: ElementRef<HTMLInputElement>;

  @Input() autoFocus: boolean = false;
  inputId: string = '';
  passwordVisible: boolean = false;
  showValidationMessages: boolean = false;
  cellphoneMask = [/[0]/, /[9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
  emailMask: MaskitoOptions = {
    mask: /^[\w.%+-]*@?[\w.-]*\.?[a-zA-Z]{0,}$/,
    preprocessors: [
      ({ elementState, data }, actionType) => {
        const { value, selection } = elementState;
        // Allow typing '@' only if not already present and action is insert
        if (data === '@' && !value.includes('@') && actionType === 'insert') {
          return {
            elementState: { value, selection },
            data, // Pass '@' to be handled by the mask
          };
        }
        // Allow other characters to be handled by the mask
        return {
          elementState: { value, selection },
          data: actionType === 'insert' ? data : '',
        };
      },
    ],
    postprocessors: [
      ({ value, selection }) => {
        const trimmedValue = value.trim();
        return { value: trimmedValue, selection };
      },
    ],
  };

  constructor(private cdr: ChangeDetectorRef) {
    this.inputId = `textInput-${uniqueIdCounter++}`;
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();

    if(this.autoFocus) {
      this.focus();
    }
  }
  focus() {
    this.inputElement?.nativeElement.focus();
  }
  test(textInput: any) {
  }

  value: any;
  onChange = (value: any) => { };
  onTouched = () => { };

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
    this.value = val; // update internal value
    this.onChange(val); // notify Angular form
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  onBlur() {
    this.onTouched();
  }
  setDisabledState?(isDisabled: boolean): void { }
}

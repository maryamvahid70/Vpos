import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { AppSetting } from '../../core/resources/app-setting';

@Injectable({
  providedIn: 'root'
})
export class SwalService {
  private swalButtonClasses: any = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    success: 'btn btn-success',
    error: 'btn btn-danger',
    info: 'btn btn-info',
    warning: 'btn btn-warning'
  };

fireSwal(options: {
  title?: string;
  text?: string;
  width?: number;
  timer?: number;
  isToast?: boolean;
  status?: 'success' | 'error' | 'info' | 'warning' | 'primary' | 'secondary';
  buttonType?: 'success' | 'error' | 'info' | 'warning' | 'primary' | 'secondary';
  showCancelButton?: boolean;
  confirmText?: string;
  cancelText?: string;
  html?: string;
}) {
  const {
    title,
    text = 'عملیات با موفقت انجام شد.',
    width,
    timer,
    isToast = false,
    status = 'success',
    buttonType = 'primary',
    showCancelButton = false,
    confirmText = 'تأیید',
    cancelText = 'انصراف',
    html
  } = options;

  const { background, color, width: statusWidth } = this.getStatusStyles(status);

  const baseConfig: any = {
    title,
    text,
    width: width ?? statusWidth,
    icon: ['success', 'error', 'info', 'warning'].includes(status) ? status : undefined,
    background: isToast ? background : undefined,
    color: isToast ? color : undefined,
    toast: isToast,
    position: isToast ? 'bottom-left' : 'center',
    showConfirmButton: !isToast,
    showCancelButton,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: 'var(--primary)',
    cancelButtonColor: '#DE3A3A',
    timer: timer ?? (isToast ? 5000 : undefined), // ✅ تایمر درست اعمال میشه
    timerProgressBar: isToast,
    html: html,
    customClass: {
      confirmButton: this.swalButtonClasses[buttonType],
      cancelButton: this.swalButtonClasses['error'],
      htmlContainer: isToast ? 'custom-swal-html-container' : '',
      popup: isToast ? 'custom-swal-popup-container' : '',
      timerProgressBar: isToast ? 'custom-swal-time-progress-bar-container' : '',
    }
  };

  return Swal.fire(baseConfig); // ✅ مستقیماً fire کن، بدون mixin
}


  private getStatusStyles(status: string) {
    switch (status) {
      case 'success':
        return { background: 'var(--success-07)', color: 'var(--white)', width: 350, height: 80 };
      case 'error':
        return { background: 'var(--error-07)', color: 'var(--white)', width: 350, height: 80 };
      case 'info':
        return { background: 'var(--primary)', color: 'var(--white)', width: 350, height: 80 };
      case 'warning':
        return { background: 'var(--warning-08)', color: 'var(--white)', width: 350, height: 80 };
      default:
        return { background: 'var(--primary)', color: 'var(--white)', width: 350, height: 80 };
    }
  }
}

import { Injectable } from '@angular/core';
import { Width } from 'ngx-owl-carousel-o/lib/services/carousel.service';
import Swal from 'sweetalert2';
import { AppSetting } from '../../core/resources/app-setting';
import { IExpandablePanelPostion } from '../../core/interfaces/expandable-panel-position.interface';

@Injectable({
  providedIn: 'root',
})
export class HelperService{
  static getCSSVar(arg0: string): string | import("chart.js/dist/types/utils")._DeepPartialObject<CanvasGradient> | import("chart.js/dist/types/utils")._DeepPartialObject<CanvasPattern> | undefined {
      throw new Error("Method not implemented.");
  }
 
  constructor() {}

  setToLocalStorage(key:string, val:any) {
    const data = JSON.stringify(val);
    localStorage.setItem(key, data);
  }

  getFromLocalStorage(key:string) {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }

  removeFromLocalStorage(key:string) {
    localStorage.removeItem(key);
  }

  getFileType(fileName: any) {
    const arr = fileName.split('.');
    return arr[arr.length - 1]
  }

  
  // Button style classes for SweetAlerts
  swalButtonClasses: Record<string, string> = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    success: 'btn btn-success',
    danger: 'btn btn-danger',
    warning: 'btn btn-warning',
    info: 'btn btn-info',
  };
  // Map status to styles
  private getStatusStyles( status: 'success' | 'error' | 'info' | 'warning' | 'primary' | 'secondary' ): { background: string; color: string; width: string; height: string }{
    const map: Record< string, { background: string; color: string ,width:string,height:string}> = {
      success: { background: 'var(--success-07)', color: 'var(--white)', width:'439px',height:'48px' },
      error: { background: 'var(--error-07)', color: 'var(--white)' , width:'439px',height:'48px'},
      info: { background: '#2563eb', color: 'var(--white)' , width:'439px',height:'48px'},
      warning: { background: 'var(--warning-07)', color: 'var(--white)', width:'439px',height:'48px' },
      primary: { background: 'var(--primary)', color: 'var(--white)', width:'439px',height:'48px' },
      secondary: { background: 'var(--secondary)', color: 'var(--white)', width:'439px',height:'48px' },
    };
    return map[status] || map['primary'];
  }
  // Unified method to show SweetAlert Modal/Toast
  fireSwal(options: {  text?: string; width?:number, timer?:number, title?:string, isToast?: boolean; status?: 'success' | 'error' | 'info' | 'warning' | 'primary' | 'secondary'; buttonType?: 'success' | 'error' | 'info' | 'warning' | 'primary' | 'secondary'}) {
    const { title, text = 'عملیات با موفقت انجام شد.', timer, width, isToast = false, status = 'success', buttonType = 'primary'} = options;
    const { background, color, width: statusWidth, height: statusHeight } = this.getStatusStyles(status);
    const baseConfig: any = {
      title,
      text,
      width: width ?? statusWidth,
      icon: !isToast ? ['success', 'error', 'info', 'warning'].includes(status) ? status : undefined : undefined,
      background: isToast ? background : undefined,
      color: isToast ? color : undefined,
      toast: isToast,
      position: isToast ? 'bottom-left' : 'center',
      showConfirmButton: !isToast,
      confirmButtonText: 'متوجه شــدم',
      timer: timer ? timer : isToast ? 3000 : undefined,
      timerProgressBar: isToast,
      customClass: {
        confirmButton: this.swalButtonClasses[buttonType],
        htmlContainer: isToast ? 'custom-swal-html-container' : '',
        popup: isToast ? 'custom-swal-popup-container' : '',
        timerProgressBar: isToast ? 'custom-swal-time-progress-bar-container' : '',
      }
    };
    const swalInstance = Swal.mixin({ ...baseConfig });
    swalInstance.fire();
  }


  calcMouseEventPosition(event:MouseEvent):DOMRect {
    event.preventDefault(); // Prevent default right-click menu
    const element = event.target as HTMLElement;
    const elementRect = element.getBoundingClientRect();
    return elementRect
  }
  calcRightExpandablePanelPosition(domRect:DOMRect):IExpandablePanelPostion {
    const expandablePanelPosition: IExpandablePanelPostion = {top:domRect.top , left : domRect.left + domRect.width + 5};
    return expandablePanelPosition
  }
  calcLeftExpandablePanelPosition(domRect: DOMRect): IExpandablePanelPostion {
    const expandablePanelPosition: IExpandablePanelPostion = {top:domRect.top , right : window.innerWidth - domRect.right + domRect.width + 5};
    return expandablePanelPosition
  }
  calcBottomExpandablePanelPosition(domRect: DOMRect): IExpandablePanelPostion {
    const expandablePanelPosition: IExpandablePanelPostion = {top:domRect.top + domRect.height + 5 , right :  window.innerWidth - domRect.right};
    return expandablePanelPosition
  }
  calcTopExpandablePanelPosition(domRect: DOMRect): IExpandablePanelPostion {
    const expandablePanelPosition: IExpandablePanelPostion = {bottom:window.innerHeight - domRect.top + 5, right :  window.innerWidth - domRect.right};
    return expandablePanelPosition
  }
  getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  }

  getChartColors() {
    return [this.getCSSVar('--primary'), this.getCSSVar('--secondary'),"#4E79A7", // Blue
    "#76B7B2", // Teal
    "#EDC948", // Yellow
    "#BAB0AC" , // Gray
    "#59A14F", // Green
    "#F28E2B", // Orange
    "#E15759", // Reda
    "#B07AA1", // Purple
    "#FF9DA7", // Pink
      "#9C755F", // Brown
    ]
  }
}



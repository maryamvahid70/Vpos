import { AppSetting } from './../../../core/resources/app-setting';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TerminalLoginViewModel } from '../../../core/viewModels/terminal-login-view-model';
import { TerminalResetPasswordViewModel } from '../../../core/viewModels/terminal-reset-password-view-model';
import { TokenViewModel } from '../../../core/viewModels/token-view-model';
import { MessageViewModel } from '../../../core/viewModels/message-view-model';
import { OTPViewModel } from '../../../core/viewModels/otp-view-model';
import { SwalService } from '../../../shared/services/alert.service';
import { TerminalViewModel } from '../../../core/viewModels/terminal-view-model';
import { ResultViewModel } from '../../../core/viewModels/result-view-model';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { ResponsiveService } from '../../../shared/services/responsive-services';
import { appConfig } from '../../../../app.config';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  @ViewChild('firstInput') firstInput!: ElementRef<HTMLInputElement>;

  captchaImage: string = '';
  password: TerminalResetPasswordViewModel = new TerminalResetPasswordViewModel();
  version: string = '';
  otpShow: boolean = false;
  form: TerminalLoginViewModel = new TerminalLoginViewModel;
  token: TokenViewModel = new TokenViewModel();
  cellphone: string = '';
  otpData: OTPViewModel = new OTPViewModel();
  otpClicked: boolean = false;
  interval: any;
  timeLeft: number = 0;
  isLoadLogin = false;
  terminalData: TerminalViewModel = new TerminalViewModel();
  fullVersion = '';
  otp: any = {
    OTP1: '',
    OTP2: '',
    OTP3: '',
    OTP4: '',
    OTP5: '',
    OTP6: '',
  }

  constructor(private swal: SwalService, private router: Router, private http: HttpClient, public responsiveService: ResponsiveService) {
   }

  ngOnInit() {
    const clientVersion = localStorage.getItem("version");
    this.fullVersion = 'ver: ' + clientVersion + '(client: 1.' + AppSetting.version + ')'
    this.getCaptcha(this.form);
  }

  prepareDataForSubmit() {
    return {
      ...this.form,
      TerminalNumber: 'T' + this.form.TerminalNumber,
      ChannelTypeID: 13
    };
  }

  submit(form: NgForm) {
    if (form.valid) {
      this.isLoadLogin = true;
      const formData = this.prepareDataForSubmit();
      const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });
      this.http.post<TokenViewModel>(`${appConfig.apiBaseUrl}/authentication/loginToWebVPOS`, formData, { headers: reqHeader })
        .subscribe((result: TokenViewModel) => {

          if (result.Status == true && result.TokenType === 'AUTHENTICATED') {
            this.token = result;
            this.tokenWriter(this.token);
            this.getCellphoneOfTerminal();
            this.sendOTP();
            this.otpShow = true;
            setTimeout(() => { this.firstInput?.nativeElement.focus() }, 0);
          } else {
            this.getCaptcha(this.form);
            this.swal.fireSwal({ text: result.Message, isToast: true, status: 'error' });
          }
          this.isLoadLogin = false;
        });
    }
  }

  tokenWriter(token: TokenViewModel): boolean {
    localStorage.setItem('userToken', token.Token);
    localStorage.setItem('refreshToken', token.RefreshToken);
    localStorage.setItem('expiration', token.Expiration.toString());
    localStorage.setItem('stateToken', "OK");
    return true;
  }

  getCaptcha(form: TerminalLoginViewModel) {
    form.CaptchaWord = "";
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });
    this.http.get<string[]>(`${appConfig.apiBaseUrl}/authentication/getCaptcha/3/0`, { headers: reqHeader })
      .subscribe((result: string[]) => {
        this.captchaImage = result[0];
        form.CaptchaSessionID = result[1];
        this.password.CaptchaSessionID = result[1];
        this.version = result[2];
        localStorage.setItem("version", this.version);
        this.otpShow = false;
      });
  }

  goToForgetPass() {
    this.router.navigate(['auth/forget-pass']);
  }

  verifyTerminal() {
    this.terminalData = {
      ...this.terminalData,
      TerminalNumber: 'T' + this.form.TerminalNumber,
      MerchantID: this.form.MerchantID
    }
    this.http
      .post<MessageViewModel>(`${appConfig.apiBaseUrl}/webVPOS/verifyTerminal`, this.terminalData).subscribe({
        next: (res: MessageViewModel) => {
          if (res.Status === 'success')
            this.getMyTerminal();
          else
            this.swal.fireSwal({ text: res.Message, isToast: true, status: 'error' });
        },
      });
  }

  getMyTerminal() {
    this.http
      .get<ResultViewModel<TerminalViewModel>>(`${appConfig.apiBaseUrl}/webVPOS/getMyTerminal/T${this.form.TerminalNumber}`).subscribe({
        next: (res: ResultViewModel<TerminalViewModel>) => {
          if (res.Result) {
            localStorage.setItem('terminalInfo', JSON.stringify(res.Result));
            swal.fire({
              icon: 'success',
              title: 'احراز هویت شما با موفقیت انجام شد',
              text: 'تا ثانیه‌ای دیگر به صفحه اصلی منتقل می‌شوید',
              showConfirmButton: false,
              showCancelButton: false,
              timer: 3000,
              didClose: () => {
                this.router.navigate(['/gateway/payment']);
              }
            })
          }
        },
      });
  }

  // ====================== OTP Codes ======================

  // ====== متد گرفتن شماره موبایل کاربر
  getCellphoneOfTerminal() {
    this.http
      .get<MessageViewModel>(`${appConfig.apiBaseUrl}/webVPOS/getCellphoneOfTerminal/T${this.form.TerminalNumber}`).subscribe({
        next: (res: MessageViewModel) => {
          this.cellphone = res.Value;
        },
      });
  }

  formatTime(timeLeft: number): string {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  // // ====== متد ارسال OTP
  sendOTP() {
    this.otp.OTP1 = '';
    this.otp.OTP2 = '';
    this.otp.OTP3 = '';
    this.otp.OTP4 = '';
    this.otp.OTP5 = '';
    this.otp.OTP6 = '';
    this.otpData.OTP = '';
    this.otpClicked = true;
    this.startTimer();

    const body = {
      TerminalNumber: 'T' + this.form.TerminalNumber
    }

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    this.http
      .post<MessageViewModel>(`${appConfig.apiBaseUrl}/authentication/sendTerminalLoginOTP`, body, httpOptions)
      .subscribe({
        next: (res: MessageViewModel) => { },
        error: (error: any) => {
          this.otpClicked = false;
        },
      });
  }

  // // ====== متد چک کردن OTP
  checkOTP() {
    const body: Partial<OTPViewModel> = {
      TerminalNumber: 'T' + this.form.TerminalNumber,
      OTP: this.otpData.OTP,
      MerchantID: this.form.MerchantID,
      ApiKey: null
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    this.http
      .post<TokenViewModel>(
        `${appConfig.apiBaseUrl}/authentication/twoFactorWebVPOS`,
        body,
        httpOptions
      )
      .subscribe({
        next: (res: TokenViewModel) => {
          if (res.Status == true) {
            this.token = res;
            if (this.tokenWriter(this.token)) {
              // this.swal.fireSwal({ text: 'احراز هویت شما با موفقیت انجام شد.', isToast: true, status: 'success' });

              this.verifyTerminal();
            }
          } else {
            this.swal.fireSwal({ text: res.Message, isToast: true, status: 'error' });
            this.otpData.OTP = '';
            this.otp.OTP1 = '';
            this.otp.OTP2 = '';
            this.otp.OTP3 = '';
            this.otp.OTP4 = '';
            this.otp.OTP5 = '';
            this.otp.OTP6 = '';
            setTimeout(() => {
              this.firstInput.nativeElement.focus();
            }, 3000);
          }
        },
        error: (error: any) => {
          this.otpShow = false;
        },
      });
  }

  // // ====== متد تایمر
  startTimer() {
    clearInterval(this.interval);
    this.timeLeft = 120;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.otpClicked = false;
      }
    }, 1000);
  }

  // // ====== مدیریت فکوس روی اینپوت‌های OTP
  changeFocus(id: number, event?: any) {
    const inputValue = (event.target as HTMLInputElement).value;

    if (inputValue.length === 1) {
      if (id < 6) {
        event.target.nextElementSibling?.focus();
      }
    } else if (event.inputType === 'deleteContentBackward') {
      if (id > 1) {
        event.target.previousElementSibling?.focus();
      }
    }

    if (id === 6) {
      if (this.otp.OTP1 && this.otp.OTP2 && this.otp.OTP3 && this.otp.OTP4 && this.otp.OTP5 && this.otp.OTP6) {
        this.otpData.OTP = this.otp.OTP1 + this.otp.OTP2 + this.otp.OTP3 + this.otp.OTP4 + this.otp.OTP5 + this.otp.OTP6;
        this.checkOTP();
      }
    }
  }

  // // ====== هندل کردن کیبورد برای OTP
  keyupOtp(id: number, event?: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    const isBackspace = event.key === 'Backspace';
    const isNumber =
      event.key >= '0' && event.key <= '9';

    if (isBackspace) {
      if (inputValue === '') {
        if (id > 1) {
          event.srcElement.previousElementSibling.focus();
          this.otp[`OTP${id}`] = '';
        }
      } else {
        return;
      }
    } else {
      if (this.otp[`OTP${id}`] !== '' && isNumber) {
        event.srcElement.nextElementSibling?.focus();
        this.otp[`OTP${id + 1}`] = event.key;
      }
    }
    if (id === 5 && this.otp.OTP5 !== '') {
      if (
        this.otp.OTP1 &&
        this.otp.OTP2 &&
        this.otp.OTP3 &&
        this.otp.OTP4 &&
        this.otp.OTP5 &&
        this.otp.OTP6
      ) {
        this.otpData.OTP =
          this.otp.OTP1 +
          this.otp.OTP2 +
          this.otp.OTP3 +
          this.otp.OTP4 +
          this.otp.OTP5 +
          this.otp.OTP6;
        this.checkOTP();
      }
    }
  }

  // // ====== برگشت از صفحه OTP به لاگین
  backToLogin() {
    this.getCaptcha(this.form);
    this.otpShow = false;
  }

  async testShare() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'تست',
        text: 'سلام',
        url: window.location.href // پیشنهاد می‌شود URL را هم اضافه کنید
      });
      console.log('محتوا با موفقیت به اشتراک گذاشته شد');
    } catch (e) {}
  }
}


}

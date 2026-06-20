import { AppSetting } from './../../../core/resources/app-setting';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TerminalResetPasswordViewModel } from '../../../core/viewModels/terminal-reset-password-view-model';
import { MessageViewModel } from '../../../core/viewModels/message-view-model';
import { SwalService } from '../../../shared/services/alert.service';
import { appConfig } from '../../../../app.config';
import { ResponsiveService } from '../../../shared/services/responsive-services';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrl: './forget-pass.component.scss',
  standalone: false
})
export class ForgetPassComponent {

  captchaImage: string = '';
  password: TerminalResetPasswordViewModel = new TerminalResetPasswordViewModel();
  version: string = '';
  otpShow: boolean = false;
  form: TerminalResetPasswordViewModel = new TerminalResetPasswordViewModel;
  isLoadForm = false;
  fullVersion = '';

  constructor(private swal: SwalService, private router: Router, private http: HttpClient, public responsiveService: ResponsiveService) { }

  ngOnInit() {
    const clientVersion = localStorage.getItem("version");
    this.fullVersion = 'ver: ' + clientVersion + '(client: 1.' + AppSetting.version + ')';
    this.getCaptcha(this.form);
  }

  prepareDataForSubmit() {
    return {
      ...this.form,
      TerminalNumber: this.form.TerminalNumber.includes('T') === false ? 'T' + this.form.TerminalNumber : this.form.TerminalNumber,
      Cellphone: this.form.Cellphone.replaceAll('-', ''),
      ApiKey: AppSetting.apiKey
    };
  }

  submit(form: any) {
    if (form.valid) {
      this.isLoadForm = true;
      const body = this.prepareDataForSubmit();
      const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });
      this.http.post<MessageViewModel>(`${appConfig.apiBaseUrl}/authentication/resetTerminalPassword`, body, { headers: reqHeader })
        .subscribe({
          next: (result: MessageViewModel) => {
            this.isLoadForm = false;
            this.swal.fireSwal({ text: result.Message, isToast: true, status: result.Status === 'success' ? 'success' : 'error' });
            if (result.Status === 'success')
              this.router.navigate(['auth/login']);
            else
              this.getCaptcha(this.form);
          },
          error: () => {
            this.isLoadForm = false;
          }
        })
    }
  }

  getCaptcha(form: TerminalResetPasswordViewModel) {
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

  changePass() {

  }

  goToLogin() {
    this.router.navigate(['auth/login']);
  }
}


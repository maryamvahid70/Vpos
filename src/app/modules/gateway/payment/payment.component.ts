import { ResponsiveService } from './../../../shared/services/responsive-services';
import { TerminalViewModel } from './../../../core/viewModels/terminal-view-model';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SegmentedInputModel } from '../../../core/models/segmented-input-model';
import { TimerService } from '../../../shared/services/timer.service';
import { HttpClient } from '@angular/common/http';
import { MessageViewModel } from '../../../core/viewModels/message-view-model';
import { SwalService } from '../../../shared/services/alert.service';
import { TransferViewModel } from '../../../core/viewModels/transfer-view-model';
import { AppSetting } from '../../../core/resources/app-setting';
import { NgForm } from '@angular/forms';
import { NumberToWordsService } from '../../../shared/services/number-to-words.service';
import { VoucherMessageViewModel } from '../../../core/viewModels/voucher-message-view-model';
import { OTPViewModel } from '../../../core/viewModels/otp-view-model';
import { appConfig } from '../../../../app.config';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {

  @ViewChildren('inpE1, inpE2, inpE3, inpE4, inpE5') inputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChild('paymentForm') paymentForm!: NgForm;
  @ViewChild('receipt') receipt!: ElementRef;
  @ViewChild('shareReceipt') receiptRef!: ElementRef<HTMLElement>;

  pocket: SegmentedInputModel = new SegmentedInputModel();
  selectedType = 'DynamicBarcode';
  form: any = {};
  timerDynamicCode$: any;
  terminalInfo: TerminalViewModel = new TerminalViewModel();
  terminalData: TerminalViewModel = new TerminalViewModel();
  QRImg = '';
  transferData: TransferViewModel = new TransferViewModel();
  isLoadBtn = false;
  amountInWords: string = '';
  voucherData: VoucherMessageViewModel = new VoucherMessageViewModel();
  isShowVoucher = false;
  timerState$ = this.timerService.state$;
  isOpen = false;
  isExporting = false;
  isOpenShareMenu = false;

  constructor(public timerService: TimerService, private http: HttpClient, private swal: SwalService, private numberToWords: NumberToWordsService, public responsiveService: ResponsiveService) { }

  ngOnInit(): void {
    this.isShowVoucher = false;
    const tInfo = localStorage.getItem('terminalInfo');
    if (tInfo && tInfo !== '')
      this.terminalInfo = JSON.parse(tInfo);
    this.generateQRCode();
  }

  generateQRCode() {
    this.terminalData = {
      ...this.terminalData,
      TerminalNumber: this.terminalInfo.TerminalNumber,
      MerchantID: this.terminalInfo.MerchantID
    }
    this.http
      .post<MessageViewModel>(`${appConfig.apiBaseUrl}/webVPOS/generateQRCode`, this.terminalData).subscribe({
        next: (res: MessageViewModel) => {
          this.QRImg = res.Value;
        },
      });
  }

  onChooseType(type: string) {
    this.onCancel();
    this.selectedType = type;
  }

  onInput(id: number, inputElem: HTMLInputElement, event: Event) {

    inputElem.value = inputElem.value.replace(/\D/g, '');
    this.pocket[`Seg${id}`] = inputElem.value;
    const maxLen = Number(inputElem.getAttribute('maxlength') || 4);

    if (inputElem.value.length > maxLen) {
      inputElem.value = inputElem.value.slice(0, maxLen);
      this.pocket[`Seg${id}`] = inputElem.value;
    }
    this.pocketBuildCombinedValue();
    if (inputElem.value.length >= maxLen) {
      const next = this.getInputById(id + 1);
      if (next) {
        next.focus();
      }
    }
  }

  onKeydown(id: number, inputElem: HTMLInputElement, event: KeyboardEvent) {
    const key = event.key;

    if (key === 'Backspace') {
      setTimeout(() => {
        if (inputElem.value.length === 0) {
          const prev = this.getInputById(id - 1);
          if (prev) {
            prev.focus();
            this.pocket[`Seg${id - 1}`] = prev.value;
          }
        }
        this.pocketBuildCombinedValue();

      }, 0);
      return;
    }

    if (key.length === 1 && !/^\d$/.test(key)) {
      event.preventDefault();
      return;
    }
  }

  private pocketBuildCombinedValue() {
    const s1 = this.pocket.Seg1 ?? '';
    const s2 = this.pocket.Seg2 ?? '';
    const s3 = this.pocket.Seg3 ?? '';
    const s4 = this.pocket.Seg4 ?? '';
    const s5 = this.pocket.Seg5 ?? '';
    this.pocket.Seg = s1 + s2 + s3 + s4 + s5;
  }

  private getInputById(id: number): HTMLInputElement | null {
    const list = this.inputs?.toArray() ?? [];
    const el = list[id - 1];
    return el ? el.nativeElement : null;
  }

  submit() {
    let actionName = '';
    if (this.selectedType === 'StaticBarcode' && this.form.OTP && this.pocket.Seg.length === 16 && this.form.Amount) {
      actionName = 'transferByPocket';
      this.transfer(actionName);
    }

    else if (this.selectedType === 'DynamicBarcode' && this.pocket.Seg.length === 22 && this.form.Amount) {
      actionName = 'transferByBarcode';
      this.transfer(actionName);
    }
  }

  transfer(actionName: string) {

    this.isLoadBtn = true;

    const body: TransferViewModel = {
      ...this.transferData,
      ApiKey: AppSetting.apiKey,
      FromPocketNumber: this.pocket.Seg,
      ToPocketNumber: this.terminalInfo.WalletTitle,
      TerminalNumber: this.terminalInfo.TerminalNumber,
      Amount: this.form.Amount.replaceAll(',', ''),
      OTP: this.form.OTP,
      SendTime: new Date().toTimeString().split(' ')[0]
    }

    this.http
      .post<VoucherMessageViewModel>(`${appConfig.apiBaseUrl}/purchase/${actionName}`, body).subscribe({
        next: (result: VoucherMessageViewModel) => {
          this.isLoadBtn = false;
          if (result.Status === 'success') {
            this.swal.fireSwal({ text: result.Message, isToast: true, status: 'success' });
            this.voucherData = result;
            this.isShowVoucher = true;
            this.onCancel();
          }
          else if (result.Status === 'error') {
            var htmlContent = '';
            if (result.Errors.length === 0)
              htmlContent = `<span>` + result.Message + `</span>`;
            else {
              var errors = '';
              for (let item of result.Errors)
                errors = errors + `<li>` + item.ErrorMessage + `</li>`;
              htmlContent = `
                  <ul style="text-align: right; direction: rtl;"><li>`+ result.Message + `</li>` + errors + `</ul>`;
            }
            this.swal.fireSwal({ isToast: true, status: 'error', html: htmlContent });
          }

        },
        error: () => {
          this.isLoadBtn = false;
        }
      });
  }

  getOtp() {
    const body: Partial<OTPViewModel> = {
      TerminalNumber: this.terminalInfo.TerminalNumber,
      MerchantID: this.terminalInfo.MerchantID,
      ApiKey: AppSetting.apiKey,
      PocketNumber: this.pocket.Seg,
      Amount: parseFloat(this.form.Amount?.replace(/,/g, ''))
    };

    this.http
      .post<MessageViewModel>(`${appConfig.apiBaseUrl}/purchase/sendPurchaseOTP`, body).subscribe({
        next: (result: MessageViewModel) => {
          this.swal.fireSwal({ text: result.Message, isToast: true, status: result.Status === 'success' ? 'success' : 'error' });
          if (result.Status === 'success')
            this.timerService.start(120);
        },
      });

  }

  onCancel() {
    if (this.paymentForm)
      this.paymentForm.resetForm();
    this.timerService.forceFinish();
    Object.keys(this.pocket).forEach(key => {
      delete this.pocket[key];
    });

    Object.keys(this.form).forEach(key => {
      delete this.form[key];
    });
  }

  updateWords() {
    if (this.form.Amount) {
      const fltr = this.form.Amount.replaceAll(',', '');
      this.amountInWords = this.numberToWords.convertNumberToWords(parseInt(fltr));
    }
  }

  closeVoucher() {
    this.isShowVoucher = false;
  }

  onPrint() {

    const html = this.receipt.nativeElement.innerHTML;
    const iframe = document.createElement('iframe');

    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;

    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <base href="/VPOS/">
            <style>
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 100;
                src: url('assets/fonts/Peyda/standard/woff2/PeydaWeb-Thin.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/standard/woff/PeydaWeb-Thin.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 200;
                src: url('assets/fonts/Peyda/standard/woff2/PeydaWeb-ExtraLight.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/standard/woff/PeydaWeb-ExtraLight.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 300;
                src: url('assets/fonts/Peyda/standard/woff2/PeydaWeb-Light.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/standard/woff/PeydaWeb-Light.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: normal;
                src: url('assets/fonts/Peyda/standard/woff2/PeydaWeb-Regular.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/standard/woff/PeydaWeb-Regular.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 500;
                src: url('assets/fonts/Peyda/standard/woff2/PeydaWeb-Medium.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/standard/woff/PeydaWeb-Medium.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 600;
                src: url('assets/fonts/Peyda/standard/woff2/PeydaWeb-SemiBold.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/standard/woff/PeydaWeb-SemiBold.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }

              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 800;
                src: url('assets/fonts/Peyda/standard/woff2/PeydaWeb-ExtraBold.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/standard/woff/PeydaWeb-ExtraBold.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 900;
                src: url('assets/fonts/Peyda/standard/woff2/PeydaWeb-Black.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/standard/woff/PeydaWeb-Black.woff') format('woff')  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: bold;
                src: url('assets/fonts/Peyda/standard/woff2/PeydaWeb-Bold.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/standard/woff/PeydaWeb-Bold.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }

              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 100;
                src: url('assets/fonts/Peyda/nonEnglish/woff2/PeydaWebNoEn-Thin.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/nonEnglish/woff/PeydaWebNoEn-Thin.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 200;
                src: url('assets/fonts/Peyda/nonEnglish/woff2/PeydaWebNoEn-ExtraLight.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/nonEnglish/woff/PeydaWebNoEn-ExtraLight.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 300;
                src: url('assets/fonts/Peyda/nonEnglish/woff2/PeydaWebNoEn-Light.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/nonEnglish/woff/PeydaWebNoEn-Light.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 500;
                src: url('assets/fonts/Peyda/nonEnglish/woff2/PeydaWebNoEn-Medium.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/nonEnglish/woff/PeydaWebNoEn-Medium.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 600;
                src: url('assets/fonts/Peyda/nonEnglish/woff2/PeydaWebNoEn-SemiBold.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/nonEnglish/woff/PeydaWebNoEn-SemiBold.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 800;
                src: url('assets/fonts/Peyda/nonEnglish/woff2/PeydaWebNoEn-ExtraBold.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/nonEnglish/woff/PeydaWebNoEn-ExtraBold.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 900;
                src: url('assets/fonts/Peyda/nonEnglish/woff2/PeydaWebNoEn-Black.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/nonEnglish/woff/PeydaWebNoEn-Black.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: bold;
                src: url('assets/fonts/Peyda/nonEnglish/woff2/PeydaWebNoEn-Bold.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/nonEnglish/woff/PeydaWebNoEn-Bold.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: normal;
                src: url('assets/fonts/Peyda/nonEnglish/woff2/PeydaWebNoEn-Regular.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/nonEnglish/woff/PeydaWebNoEn-Regular.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }

              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 100;
                src: url('assets/fonts/Peyda/farsiNumerals/woff2/PeydaWebFaNum-Thin.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/farsiNumerals/woff/PeydaWebFaNum-Thin.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 200;
                src: url('assets/fonts/Peyda/farsiNumerals/woff2/PeydaWebFaNum-ExtraLight.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/farsiNumerals/woff/PeydaWebFaNum-ExtraLight.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 300;
                src: url('assets/fonts/Peyda/farsiNumerals/woff2/PeydaWebFaNum-Light.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/farsiNumerals/woff/PeydaWebFaNum-Light.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 500;
                src: url('assets/fonts/Peyda/farsiNumerals/woff2/PeydaWebFaNum-Medium.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/farsiNumerals/woff/PeydaWebFaNum-Medium.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 600;
                src: url('assets/fonts/Peyda/farsiNumerals/woff2/PeydaWebFaNum-SemiBold.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/farsiNumerals/woff/PeydaWebFaNum-SemiBold.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }

              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 800;
                src: url('assets/fonts/Peyda/farsiNumerals/woff2/PeydaWebFaNum-ExtraBold.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/farsiNumerals/woff/PeydaWebFaNum-ExtraBold.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: 900;
                src: url('assets/fonts/Peyda/farsiNumerals/woff2/PeydaWebFaNum-Black.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/farsiNumerals/woff/PeydaWebFaNum-Black.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: bold;
                src: url('assets/fonts/Peyda/farsiNumerals/woff2/PeydaWebFaNum-Bold.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/farsiNumerals/woff/PeydaWebFaNum-Bold.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @font-face {
                font-family: Peyda;
                font-style: normal;
                font-weight: normal;
                  src: url('assets/fonts/Peyda/farsiNumerals/woff2/PeydaWebFaNum-Regular.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
                  url('assets/fonts/Peyda/farsiNumerals/woff/PeydaWebFaNum-Regular.woff') format('woff');  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
              }
              @page {
                margin: 0;
              }

              body {
                margin: 0;
                font-family: 'peyda', sans-serif;
              }
            </style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }, 300);

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }
  }

  onToggle() {
    if (this.responsiveService.isMobile()) {
      this.isOpen = !this.isOpen;
    }
  }

  onShare() {
    this.isOpenShareMenu = !this.isOpenShareMenu;
  }

  shareText() {
    this.shareTextMethod();
   }

  saveImage() {
    this.shareReceipt();
  }

  async shareReceipt(): Promise<void> {
    try {
      this.isExporting = true;

      await new Promise(resolve =>
        setTimeout(resolve)
      );

      const buttons =
        this.receiptRef.nativeElement.querySelectorAll('.no-print');
      buttons.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });

      const canvas = await html2canvas(
        this.receiptRef.nativeElement,
        {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        }
      );
      buttons.forEach(el => {
        (el as HTMLElement).style.display = '';
      });

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });

      if (!blob) {
        return;
      }

      const file = new File(
        [blob],
        'receipt.png',
        {
          type: 'image/png'
        }
      );

      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: 'رسید پرداخت',
          files: [file]
        });
      } else {
        // دانلود به عنوان جایگزین
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'receipt.png';
        a.click();

        URL.revokeObjectURL(url);
      }
      this.isExporting = false;
    } catch (error) {
      console.error(error);
    }
  }

  async shareTextMethod(): Promise<void> {

    const text = `
رسید پرداخت ${this.terminalInfo.MerchantAliasName}

شماره سند: ${this.voucherData.VoucherNumber}
شماره جیب: ${this.voucherData.FromPocketNumber}
تاریخ و ساعت: ${this.voucherData.VoucherTime} | ${this.voucherData.VoucherDate}
شماره پایانه: ${this.voucherData.TerminalNumber}
نوع تراکنش: ${this.voucherData.TransactionTypeTitle}
مبلغ: ${this.voucherData.Amount}
  `;

    try {
      await navigator.share({
        title: 'رسید پرداخت',
        text
      });
    } catch (error) {
      console.error(error);
    }
  }

// async testShare() {
//   if (navigator.share) {
//     try {
//       await navigator.share({
//         title: 'تست',
//         text: 'سلام',
//         url: window.location.href // پیشنهاد می‌شود URL را هم اضافه کنید
//       });
//       console.log('محتوا با موفقیت به اشتراک گذاشته شد');
//     } catch (e) {}
//   }
// }

}

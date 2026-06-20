export class TerminalLoginViewModel {
    TerminalNumber: string;
    MerchantID  : number | null;
    Password : string;
    CaptchaWord: string;
    CaptchaSessionID: string;

    constructor(init?: Partial<TerminalLoginViewModel>) {
        this.TerminalNumber = init?.TerminalNumber || '';
        this.MerchantID  = init?.MerchantID  || null;
        this.Password  = init?.Password  || '';
        this.CaptchaWord = init?.CaptchaWord || '';
        this.CaptchaSessionID = init?.CaptchaSessionID || '';
    }
}